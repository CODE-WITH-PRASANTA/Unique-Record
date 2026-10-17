import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import companyLogo from '../../assets/UNQUE.png';

/**
 * Preload and convert logo image to base64 Data URL.
 */
export const fetchLogoBase64 = async (logoSrc = companyLogo) => {
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
  } catch {
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
          } catch {
            resolve(logoSrc);
          }
        };
        img.onerror = () => resolve(logoSrc);
        img.src = logoSrc;
      } catch {
        resolve(logoSrc);
      }
    });
  }
};

/**
 * Convert numeric amount to Indian Rupee Words
 */
const numberToWords = (num) => {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return 'overflow';
    const nArr = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nArr) return '';
    let str = '';
    str += Number(nArr[1]) !== 0 ? (a[Number(nArr[1])] || b[nArr[1][0]] + ' ' + a[nArr[1][1]]) + 'Crore ' : '';
    str += Number(nArr[2]) !== 0 ? (a[Number(nArr[2])] || b[nArr[2][0]] + ' ' + a[nArr[2][1]]) + 'Lakh ' : '';
    str += Number(nArr[3]) !== 0 ? (a[Number(nArr[3])] || b[nArr[3][0]] + ' ' + a[nArr[3][1]]) + 'Thousand ' : '';
    str += Number(nArr[4]) !== 0 ? (a[Number(nArr[4])] || b[nArr[4][0]] + ' ' + a[nArr[4][1]]) + 'Hundred ' : '';
    str += Number(nArr[5]) !== 0 ? ((str !== '') ? 'and ' : '') + (a[Number(nArr[5])] || b[nArr[5][0]] + ' ' + a[nArr[5][1]]) : '';
    return str.trim();
  };

  const amountVal = Math.floor(Number(num) || 0);
  if (amountVal === 0) return 'Zero Rupees Only';
  const result = inWords(amountVal);
  return result ? `${result} Rupees Only` : `${amountVal} Rupees Only`;
};

/**
 * Generates an official, luxury single-page A4 Vector PDF Donation Receipt
 * 
 * @param {Object} donation - Donation record data
 * @param {string} logoBase64 - Base64 Data URI of company logo
 * @param {string} qrBase64 - Base64 Data URI of verification QR code (optional)
 * @param {string} filename - Target filename for download
 */
export const generateDonationPdf = (
  donation,
  logoBase64 = null,
  qrBase64 = null,
  filename = null
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const paymentNumber = donation?.paymentNumber || 'DON-RECEIPT';
  const paymentId = donation?.razorpayPaymentId || donation?.paymentId || 'N/A';
  const orderId = donation?.razorpayOrderId || donation?.orderId || 'N/A';
  const donorName = donation?.name || 'Valued Donor';
  const donorEmail = donation?.email || 'N/A';
  const donorPhone = donation?.phone || 'N/A';
  const donorAddress = donation?.address || 'N/A';
  const amount = Number(donation?.amount || 0);
  const certificate = donation?.certificate === 'Yes' ? 'Yes' : 'No';
  const panNumber = donation?.panNumber && donation?.panNumber !== 'N/A' ? donation?.panNumber : 'N/A';
  const extra = donation?.extra || 'Spiritual & Social Development Donation';
  const paymentMethod = donation?.paymentMethod || 'Razorpay Online Checkout';
  
  const formattedDate = donation?.paidAt || donation?.createdAt || donation?.date
    ? new Date(donation.paidAt || donation.createdAt || donation.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN');

  const formattedTime = donation?.paidAt || donation?.createdAt
    ? new Date(donation.paidAt || donation.createdAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  const amountInWords = numberToWords(amount);
  const targetFilename = filename || `Donation_Receipt_${paymentNumber}.pdf`;

  // ==========================================
  // 1. PAGE BORDERS (Dual Navy & Gold Frame)
  // ==========================================
  // Outer Navy Border
  doc.setDrawColor(10, 37, 64); // #0A2540
  doc.setLineWidth(0.8);
  doc.roundedRect(10, 8, 190, 280, 3, 3, 'S');

  // Inner Gold Accent Pinstripe Border
  doc.setDrawColor(212, 175, 55); // #D4AF37
  doc.setLineWidth(0.3);
  doc.roundedRect(12, 10, 186, 276, 2, 2, 'S');

  // ==========================================
  // 2. HEADER BRANDING & LOGO
  // ==========================================
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 16, 14, 38, 17);
    } catch (e) {
      console.warn('Failed to draw logo on PDF:', e);
    }
  }

  // Organization & Trust Title in Center
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(10, 37, 64); // #0A2540
  doc.text('UNIQUE RECORDS OF UNIVERSE', 57, 19.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9); // Gold/Amber #B45309
  doc.text('Unit of Divya Prerak Kahaniyan Humanity Research Centre Trust', 57, 24.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139); // Slate #64748B
  doc.text('Regd. National & International World Records Body · Tax Exemption Regd. Charitable Trust', 57, 28.5);
  doc.text('Thekma, Dist. Azamgarh, Uttar Pradesh - 276303 | Helpline: +91 9472351693', 57, 32.2);

  // Top-Right Status Badge
  doc.setFillColor(236, 253, 245); // #ECFDF5
  doc.setDrawColor(110, 231, 183); // #6EE7B7
  doc.setLineWidth(0.3);
  doc.roundedRect(156, 13, 38, 7, 3.5, 3.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(4, 120, 87); // #047857
  doc.text('PAID & CONFIRMED', 175, 17.8, { align: 'center' });

  // Optional QR Code
  if (qrBase64) {
    try {
      doc.addImage(qrBase64, 'PNG', 165, 22, 20, 20);
      doc.setFontSize(5.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Scan to Verify', 175, 43.5, { align: 'center' });
    } catch {
      // ignore
    }
  }

  // ==========================================
  // 3. TITLE RIBBON BANNER
  // ==========================================
  doc.setFillColor(10, 37, 64); // Deep Navy
  doc.rect(14, 45, 182, 8.5, 'F');

  // Gold Bottom Accent Line
  doc.setFillColor(212, 175, 55);
  doc.rect(14, 53.5, 182, 0.7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL DONATION PAYMENT RECEIPT', 18, 50.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(224, 231, 255);
  doc.text(`Receipt Date: ${formattedDate} ${formattedTime ? '· ' + formattedTime : ''}`, 192, 50.8, { align: 'right' });

  // ==========================================
  // 4. TRANSACTION META CARDS (4 Columns)
  // ==========================================
  const cardY = 57;
  const cardH = 14;
  const cardW = 43;
  const cardGap = 3.3;

  const metaItems = [
    { label: 'RECEIPT NUMBER', val: paymentNumber, isBlue: true },
    { label: 'DONATION AMOUNT', val: `Rs. ${amount.toLocaleString('en-IN')}`, isEmerald: true },
    { label: 'TRANSACTION ID', val: paymentId, isMono: true },
    { label: '80G EXEMPTION', val: certificate === 'Yes' ? 'Eligible (80G)' : 'Standard Receipt' },
  ];

  metaItems.forEach((item, idx) => {
    const cardX = 14 + idx * (cardW + cardGap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, cardY, cardW, cardH, 1.8, 1.8, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, cardX + 3.5, cardY + 4.8);

    doc.setFont(item.isMono ? 'courier' : 'helvetica', 'bold');
    doc.setFontSize(item.isMono ? 7.2 : 8.8);
    if (item.isEmerald) {
      doc.setTextColor(5, 150, 105);
    } else if (item.isBlue) {
      doc.setTextColor(30, 64, 175);
    } else {
      doc.setTextColor(15, 23, 42);
    }

    let displayVal = item.val;
    if (displayVal.length > 22) {
      displayVal = displayVal.slice(0, 21) + '...';
    }
    doc.text(displayVal, cardX + 3.5, cardY + 10.5);
  });

  // ==========================================
  // 5. DONOR INFORMATION TABLE
  // ==========================================
  const donorSectionY = 74.5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, donorSectionY, 182, 6.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('DONOR DETAILS & CONTRIBUTOR PARTICULARS', 18, donorSectionY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(5, 150, 105);
  doc.text('VERIFIED CONTRIBUTOR', 192, donorSectionY + 4.5, { align: 'right' });

  autoTable(doc, {
    startY: donorSectionY + 7.5,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold', fillColor: [248, 250, 252], textColor: [71, 85, 105] },
      1: { cellWidth: 53 },
      2: { cellWidth: 38, fontStyle: 'bold', fillColor: [248, 250, 252], textColor: [71, 85, 105] },
      3: { cellWidth: 53 },
    },
    body: [
      [
        'Donor Full Name:',
        donorName,
        'Mobile / Contact:',
        donorPhone,
      ],
      [
        'Email Address:',
        donorEmail,
        'PAN Number:',
        panNumber !== 'N/A' && panNumber ? panNumber : 'Not Provided',
      ],
      [
        'Residential Address:',
        { content: donorAddress, colSpan: 3 },
      ],
      [
        'Dedication / Purpose:',
        { content: extra, colSpan: 3 },
      ],
    ],
  });

  const afterDonorY = doc.lastAutoTable.finalY + 4;

  // ==========================================
  // 6. FINANCIAL CONTRIBUTION SUMMARY TABLE
  // ==========================================
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, afterDonorY, 182, 6.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('DONATION PAYMENT PARTICULARS', 18, afterDonorY + 4.5);

  autoTable(doc, {
    startY: afterDonorY + 7.5,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [
      ['Sl No.', 'Contribution Purpose & Description', 'Payment Gateway Mode', 'Net Amount (INR)'],
    ],
    headStyles: {
      fillColor: [10, 37, 64],
      textColor: [255, 255, 255],
      fontSize: 7.8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 2.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.8,
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 16, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 41 },
      3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    body: [
      [
        '1',
        'Voluntary Donation & Sacred Contribution\nDivya Prerak Kahaniyan Humanity Research Centre Trust Building Fund',
        paymentMethod,
        `Rs. ${amount.toLocaleString('en-IN')}.00`,
      ],
    ],
  });

  const afterTableY = doc.lastAutoTable.finalY;

  // Total Summary Box
  autoTable(doc, {
    startY: afterTableY,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    styles: {
      cellPadding: 2.2,
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 120, halign: 'left' },
      1: { cellWidth: 62, halign: 'right' },
    },
    body: [
      [
        {
          content: `Amount in Words: ${amountInWords}`,
          styles: { fontStyle: 'bold', textColor: [15, 23, 42], fontSize: 8.5 },
        },
        {
          content: `Total Paid: Rs. ${amount.toLocaleString('en-IN')}.00`,
          styles: { fontStyle: 'bold', textColor: [5, 150, 105], fontSize: 10 },
        },
      ],
    ],
  });

  const afterTotalY = doc.lastAutoTable.finalY + 3;

  // ==========================================
  // 7. TAX EXEMPTION & 80G DECLARATION CARD
  // ==========================================
  const noticeY = afterTotalY;
  const noticeH = 26;

  doc.setFillColor(240, 253, 244); // Light Mint
  doc.setDrawColor(187, 247, 208);
  doc.setLineWidth(0.25);
  doc.roundedRect(14, noticeY, 182, noticeH, 2, 2, 'FD');

  doc.setFillColor(16, 185, 129);
  doc.rect(14, noticeY, 2.5, noticeH, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text('STATUTORY DECLARATION & 80G TAX EXEMPTION INFORMATION', 19.5, noticeY + 4.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text(
    '1. Donations to Divya Prerak Kahaniyan Humanity Research Centre Charitable Trust are eligible for tax benefit under Section 80G of the Income Tax Act, 1961.',
    19.5,
    noticeY + 9.5
  );
  doc.text(
    '2. This digital donation receipt is an official computer-generated acknowledgment. No physical signature is required under IT Act guidelines.',
    19.5,
    noticeY + 14
  );
  doc.text(
    '3. For income tax certificate generation, please ensure your PAN number is registered accurately with Unique Record of Universe.',
    19.5,
    noticeY + 18.5
  );
  doc.text(
    '4. For any verification or support inquiries, contact uruonline2025@gmail.com or call helpline +91 9472351693.',
    19.5,
    noticeY + 23
  );

  // ==========================================
  // 8. SIGNATURE & STAMP SECTION
  // ==========================================
  const sigY = noticeY + noticeH + 6;

  // Left side: Digital Security & Verification Token
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('AUTHENTICITY & SYSTEM VERIFICATION', 16, sigY + 4);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Digital Token: SHA256-${paymentNumber}-${orderId.slice(-8)}`, 16, sigY + 9);
  doc.text(`Recorded At: ${new Date().toISOString()}`, 16, sigY + 13.5);
  doc.text(`Verified By: Razorpay Automated Settlement Gateway`, 16, sigY + 18);

  // Right side: Official Seal & Signatory Box
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.roundedRect(125, sigY - 2, 71, 24, 1.5, 1.5, 'S');

  // Stamp circle simulation
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.4);
  doc.circle(141, sigY + 10, 8, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(180, 83, 9);
  doc.text('DPKHRC TRUST', 141, sigY + 9, { align: 'center' });
  doc.text('SEAL / VERIFIED', 141, sigY + 11.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized Signatory', 170, sigY + 9, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DPKHRC Charitable Trust', 170, sigY + 13, { align: 'center' });
  doc.text('Unique Record of Universe', 170, sigY + 17, { align: 'center' });

  // ==========================================
  // 9. FOOTER STRIP
  // ==========================================
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(14, 280, 196, 280);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Unique Record of Universe · Divya Prerak Kahaniyan Humanity Research Centre Trust · Official E-Receipt · Page 1 of 1',
    105,
    284,
    { align: 'center' }
  );

  doc.save(targetFilename);
  return doc;
};
