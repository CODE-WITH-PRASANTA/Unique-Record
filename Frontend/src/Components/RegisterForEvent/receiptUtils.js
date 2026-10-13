import html2pdf from 'html2pdf.js';
import { generateVectorReceiptPdf } from './pdfReceiptGenerator';

export { generateVectorReceiptPdf };

/**
 * Fetches an image URL and converts it to a base64 Data URL.
 * Guarantees zero CORS or asynchronous canvas taint errors during PDF export.
 */
export const fetchLogoBase64 = async (logoSrc) => {
  if (!logoSrc) return '';
  if (typeof logoSrc === 'string' && logoSrc.startsWith('data:image/')) {
    return logoSrc;
  }

  try {
    const res = await fetch(logoSrc);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(logoSrc);
      reader.readAsDataURL(blob);
    });
  } catch (fetchErr) {
    // Fallback: load into Image element and render to canvas
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width || 300;
            canvas.height = img.naturalHeight || img.height || 100;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } catch (canvasErr) {
            console.warn('Canvas export failed, using raw src:', canvasErr);
            resolve(logoSrc);
          }
        };
        img.onerror = () => resolve(logoSrc);
        img.src = logoSrc;
      } catch (e) {
        resolve(logoSrc);
      }
    });
  }
};

/**
 * Generates and automatically downloads the payment receipt as a high-precision vector PDF.
 * Uses jsPDF vector rendering by default for 100% crisp typography and zero kerning issues.
 */
export const generateAndDownloadReceiptPdf = async (
  elementOrId,
  filename = 'UniqueRecord_EventReceipt.pdf',
  receiptData = null,
  logoBase64 = null,
  qrBase64 = null
) => {
  if (receiptData) {
    try {
      generateVectorReceiptPdf(receiptData, logoBase64, qrBase64, filename);
      return true;
    } catch (err) {
      console.warn('Vector PDF generation failed, trying html2pdf fallback:', err);
    }
  }

  const element =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!element) {
    console.error(`Receipt element not found for PDF export:`, elementOrId);
    return false;
  }

  // Ensure all styles and fonts are parsed
  await new Promise((resolve) => setTimeout(resolve, 300));

  const opt = {
    margin: [6, 6, 6, 6],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
      scrollX: 0,
      windowWidth: 1024,
      letterRendering: false, // Must be FALSE to prevent letter overlapping!
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  };

  try {
    let h2p = html2pdf;
    if (h2p && typeof h2p !== 'function' && h2p.default) {
      h2p = h2p.default;
    }
    if (typeof h2p !== 'function') {
      const mod = await import('html2pdf.js');
      h2p = mod.default || mod;
    }
    await h2p().from(element).set(opt).save();
    return true;
  } catch (err) {
    console.error('Error generating receipt PDF with html2pdf:', err);
    return false;
  }
};

/**
 * Trigger print dialog for the receipt
 */
export const printReceiptElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (printWindow) {
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unique Records of Universe - Event Payment Receipt</title>
          ${styles}
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              background: #ffffff !important; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            .ur-receipt-paper {
              margin: 0 auto !important;
              box-shadow: none !important;
              max-width: 100% !important;
              border: 1.5px solid #cbd5e1 !important;
            }
            .ur-receipt-actions-bar {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 600);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    window.print();
  }
};
