import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates an official, luxury vector PDF payment receipt using jsPDF + jspdf-autotable.
 * Eliminates html2canvas kerning bugs completely.
 * 
 * @param {Object} receiptData - Complete registration & payment data
 * @param {string} logoBase64 - Base64 Data URI of company logo
 * @param {string} qrBase64 - Base64 Data URI of the verification QR code
 * @param {string} filename - Target filename for download
 */
export const generateVectorReceiptPdf = (
  receiptData,
  logoBase64 = null,
  qrBase64 = null,
  filename = 'UniqueRecord_EventReceipt.pdf'
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const appNumber = receiptData?.applicationNumber || 'EVT-RECORD';
  const receiptNo = receiptData?.receiptNo || `REC-${appNumber}`;
  const eventName = receiptData?.eventName || 'Official Record Event';
  const applicantName = receiptData?.applicantName || 'Applicant';
  const sex = receiptData?.sex || receiptData?.gender || 'N/A';
  const dob = receiptData?.dateOfBirth || receiptData?.dob || 'N/A';
  const phone = receiptData?.whatsappNumber || receiptData?.phone || 'N/A';
  const email = receiptData?.email || 'N/A';
  const fee = receiptData?.registrationFees || '₹0';
  const paymentMethod = receiptData?.paymentMethod || 'Razorpay Online Checkout';
  const paymentId = receiptData?.razorpayPaymentId || 'pay_ONLINE_PROCESSED';
  const orderId = receiptData?.razorpayOrderId || 'order_PROCESSED';

  const fullAddress = [
    receiptData?.localAddress || receiptData?.address,
    receiptData?.district,
    receiptData?.state,
    receiptData?.pinCode ? `PIN: ${receiptData?.pinCode}` : '',
  ]
    .filter(Boolean)
    .join(', ') || 'N/A';

  const qualification = receiptData?.educationalQualification || 'N/A';
  const expertise = receiptData?.expertise || 'General Participant';

  const formattedDate =
    receiptData?.date ||
    new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formattedTime =
    receiptData?.time ||
    new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  // ==========================================
  // 1. PAGE BORDERS (Navy + Gold Dual Frame)
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
  // Company Logo on Left
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
  doc.text('Regd. National & International World Records Body · 80G Humanitarian Trust', 57, 28.5);
  doc.text('Thekma, Dist. Azamgarh, Uttar Pradesh - 276303 | Helpline: +91 9472351693', 57, 32.2);

  // Top-Right: Verified Status Badge
  doc.setFillColor(236, 253, 245); // #ECFDF5
  doc.setDrawColor(110, 231, 183); // #6EE7B7
  doc.setLineWidth(0.3);
  doc.roundedRect(162, 13, 32, 6.5, 3.25, 3.25, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(4, 120, 87); // #047857
  doc.text('PAID & CONFIRMED', 178, 17.5, { align: 'center' });

  // Top-Right: QR Code
  if (qrBase64) {
    try {
      doc.addImage(qrBase64, 'PNG', 168.5, 21.5, 19, 19);
      doc.setFontSize(5.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Scan to Verify', 178, 42.5, { align: 'center' });
    } catch (e) {
      console.warn('QR code addImage failed:', e);
    }
  }

  // ==========================================
  // 3. TITLE RIBBON BANNER
  // ==========================================
  // Ribbon Navy Background
  doc.setFillColor(10, 37, 64);
  doc.rect(14, 44, 182, 8.5, 'F');

  // Gold Bottom Accent Line
  doc.setFillColor(212, 175, 55);
  doc.rect(14, 52, 182, 0.7, 'F');

  // Title Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL EVENT REGISTRATION & PAYMENT RECEIPT', 18, 49.8);

  // Date on Right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(224, 231, 255);
  doc.text(`Verified Date: ${formattedDate} · ${formattedTime}`, 192, 49.8, { align: 'right' });

  // ==========================================
  // 4. TRANSACTION META CARDS (4 Columns)
  // ==========================================
  const cardY = 55.5;
  const cardH = 13.5;
  const cardW = 43;
  const cardGap = 3.3;

  const metaItems = [
    { label: 'RECEIPT NUMBER', val: receiptNo, isBlue: true },
    { label: 'APPLICATION ID', val: appNumber, isBlue: true },
    { label: 'PAYMENT ID', val: paymentId, isMono: true },
    { label: 'ORDER ID', val: orderId, isMono: true },
  ];

  metaItems.forEach((item, idx) => {
    const cardX = 14 + idx * (cardW + cardGap);
    // Background
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(cardX, cardY, cardW, cardH, 1.8, 1.8, 'FD');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, cardX + 3.5, cardY + 4.5);

    // Value
    doc.setFont(item.isMono ? 'courier' : 'helvetica', 'bold');
    doc.setFontSize(item.isMono ? 7.2 : 8.5);
    doc.setTextColor(item.isBlue ? 30 : 15, item.isBlue ? 64 : 23, item.isBlue ? 175 : 42);
    
    // Truncate cleanly if too long
    let displayVal = item.val;
    if (displayVal.length > 20) {
      displayVal = displayVal.slice(0, 19) + '...';
    }
    doc.text(displayVal, cardX + 3.5, cardY + 10);
  });

  // ==========================================
  // 5. EVENT DETAILS HIGHLIGHT CARD
  // ==========================================
  const eventY = 72;
  const eventH = 12.5;

  // Background
  doc.setFillColor(240, 247, 255);
  doc.setDrawColor(191, 219, 254);
  doc.setLineWidth(0.25);
  doc.roundedRect(14, eventY, 182, eventH, 1.8, 1.8, 'FD');

  // Left Blue Indicator Bar
  doc.setFillColor(37, 99, 235);
  doc.rect(14, eventY, 2.5, eventH, 'F');

  // Event Label & Value
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(29, 78, 216);
  doc.text('REGISTERED TARGET EVENT', 19.5, eventY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(eventName, 19.5, eventY + 9.5);

  // Right Tag
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(138, eventY + 3.2, 54, 6.2, 1.2, 1.2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(30, 64, 175);
  doc.text('Participant Pass Slot · Confirmed', 165, eventY + 7.4, { align: 'center' });

  // ==========================================
  // 6. APPLICANT PARTICULARS TABLE (autoTable)
  // ==========================================
  const appSectionY = 87.5;
  // Header bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, appSectionY, 182, 6.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(51, 65, 85);
  doc.text('APPLICANT INFORMATION', 18, appSectionY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(5, 150, 105);
  doc.text('✓ VERIFIED PARTICULARS', 192, appSectionY + 4.5, { align: 'right' });

  autoTable(doc, {
    startY: appSectionY + 6.5,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.8,
      cellPadding: 2.8,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      textColor: [15, 23, 42],
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 116, 139], fillColor: [248, 250, 252], cellWidth: 32 },
      1: { cellWidth: 59 },
      2: { fontStyle: 'bold', textColor: [100, 116, 139], fillColor: [248, 250, 252], cellWidth: 32 },
      3: { cellWidth: 59 },
    },
    body: [
      ['Applicant Name', applicantName, 'Gender & DOB', `${sex} · DOB: ${dob}`],
      ['WhatsApp Mobile', phone, 'Registered Email', email],
      ['Complete Address', fullAddress, 'PIN / Location', `${receiptData?.district || 'N/A'}, ${receiptData?.state || ''} - ${receiptData?.pinCode || ''}`],
      ['Qualification', qualification, 'Specialization', expertise],
    ],
  });

  const afterAppY = doc.lastAutoTable.finalY + 4.5;

  // ==========================================
  // 7. INVOICE & FINANCIAL TABLE (autoTable)
  // ==========================================
  // Header bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, afterAppY, 182, 6.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(51, 65, 85);
  doc.text('PAYMENT & FEE STATEMENT', 18, afterAppY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('OFFICIAL INVOICE BREAKDOWN', 192, afterAppY + 4.5, { align: 'right' });

  autoTable(doc, {
    startY: afterAppY + 6.5,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [['S.No', 'Item Description', 'Qty', 'Payment Mode', 'Status', 'Amount (INR)']],
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.2,
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3.2,
      textColor: [15, 23, 42],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 44 },
      4: { cellWidth: 20, halign: 'center', fontStyle: 'bold', textColor: [5, 150, 105] },
      5: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
    },
    body: [
      [
        '01',
        `Event Registration & Participant Pass\n(${eventName})`,
        '1',
        paymentMethod,
        'PAID',
        fee,
      ],
    ],
  });

  const afterTableY = doc.lastAutoTable.finalY;

  // ==========================================
  // 8. GRAND TOTAL HIGHLIGHT BANNER
  // ==========================================
  doc.setFillColor(10, 37, 64);
  doc.rect(14, afterTableY, 182, 11.5, 'F');

  // Gold Left Indicator Bar
  doc.setFillColor(212, 175, 55);
  doc.rect(14, afterTableY, 2.5, 11.5, 'F');

  // Text inside Total Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(226, 232, 240);
  doc.text('TOTAL AMOUNT PAID', 19.5, afterTableY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Verified & Credited to Trust Account · Mode: ${paymentMethod}`, 19.5, afterTableY + 8.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(52, 211, 153); // Emerald Green #34D399
  doc.text(fee, 192, afterTableY + 7.8, { align: 'right' });

  // ==========================================
  // 9. AUTHENTICITY NOTICE & OFFICIAL SEAL
  // ==========================================
  const footerY = afterTableY + 16.5;

  // Left Security Notes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Security & Verification Notice:', 16, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('✓ This is an authentic computer-generated official receipt issued by Unique Records of Universe.', 16, footerY + 4.5);
  doc.text(`✓ Retain Application ID (${appNumber}) for tracking verification and event entry.`, 16, footerY + 8.8);
  doc.text(`✓ Verify live at: uniqueuniverse.org/event/registration-status?appId=${appNumber}`, 16, footerY + 13);
  
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Unique Records of Universe © ${new Date().getFullYear()} · Divya Prerak Kahaniyan Trust · All rights reserved.`, 16, footerY + 18);

  // Right Seal & Signatory
  const sealCenterX = 175;
  // Circular Seal
  doc.setDrawColor(217, 119, 6);
  doc.setFillColor(255, 251, 235);
  doc.setLineWidth(0.4);
  doc.circle(sealCenterX, footerY + 4, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(180, 83, 9);
  doc.text('★ URU ★', sealCenterX, footerY + 2.8, { align: 'center' });
  doc.setFontSize(4.8);
  doc.text('OFFICIAL SEAL', sealCenterX, footerY + 5.8, { align: 'center' });

  // Signature Line
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.line(158, footerY + 16, 192, footerY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(10, 37, 64);
  doc.text('Authorized Signatory', sealCenterX, footerY + 19.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('Unique Records of Universe', sealCenterX, footerY + 22.8, { align: 'center' });

  // Save the PDF
  doc.save(filename);
  return true;
};
