async function processPDF() {
  const fileInput = document.getElementById('pdfUpload');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload a PDF");
    return;
  }

  const existingPdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();

  // Load logo
  const logoBytes = await fetch('logo.png').then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);

  pages.forEach(page => {
    const { width, height } = page.getSize();

    // Watermark
    page.drawText('Gaurav Tour & Travels', {
      x: width / 4,
      y: height / 2,
      size: 30,
      opacity: 0.2,
      rotate: PDFLib.degrees(45)
    });

    // Logo (top)
    page.drawImage(logoImage, {
      x: 20,
      y: height - 80,
      width: 100,
      height: 50
    });

    // Footer
    page.drawText('Gaurav Tour & Travels', {
      x: width / 3,
      y: 20,
      size: 12
    });
  });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
  downloadLink.download = "Gaurav_Tour_Updated.pdf";
  downloadLink.style.display = 'block';
  downloadLink.innerText = "Download Updated PDF";
}
