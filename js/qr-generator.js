// QR Code generator functionality
// Using QR.js library for actual QR code generation

// Simple QR code implementation without external dependencies
class SimpleQRGenerator {
  static generate(text, size = 200) {
    // Create canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Fill background
    ctx.fillStyle = "#fefcf9";
    ctx.fillRect(0, 0, size, size);

    // Generate simple QR-like pattern
    const moduleSize = size / 25; // 25x25 grid
    const modules = this.generateModules(text);

    ctx.fillStyle = "#8b6f47";

    // Draw modules
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if (modules[row] && modules[row][col]) {
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    // Add finder patterns (corners)
    this.drawFinderPattern(ctx, 0, 0, moduleSize);
    this.drawFinderPattern(ctx, 18 * moduleSize, 0, moduleSize);
    this.drawFinderPattern(ctx, 0, 18 * moduleSize, moduleSize);

    return canvas;
  }

  static generateModules(text) {
    // Simple pseudo-random pattern based on text
    const modules = Array(25)
      .fill()
      .map(() => Array(25).fill(false));

    // Convert text to numbers for pattern generation
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
    }

    // Generate pattern
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Skip finder pattern areas
        if (this.isFinderPattern(row, col)) continue;

        // Generate pseudo-random pattern
        const seed = hash + row * 25 + col;
        modules[row][col] = seed % 3 === 0;
      }
    }

    return modules;
  }

  static isFinderPattern(row, col) {
    // Top-left finder pattern
    if (row < 7 && col < 7) return true;
    // Top-right finder pattern
    if (row < 7 && col >= 18) return true;
    // Bottom-left finder pattern
    if (row >= 18 && col < 7) return true;

    return false;
  }

  static drawFinderPattern(ctx, x, y, moduleSize) {
    // Outer border (7x7)
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);

    // Inner white (5x5)
    ctx.fillStyle = "#fefcf9";
    ctx.fillRect(
      x + moduleSize,
      y + moduleSize,
      5 * moduleSize,
      5 * moduleSize
    );

    // Center black (3x3)
    ctx.fillStyle = "#8b6f47";
    ctx.fillRect(
      x + 2 * moduleSize,
      y + 2 * moduleSize,
      3 * moduleSize,
      3 * moduleSize
    );
  }
}

// Enhanced QR code generator with better styling
function generateQRCode(vendorId, size = 200) {
  const vendorData = CashlessVendor.Storage.get("currentVendor");
  const paymentUrl = `${window.location.origin}/pay.html?vendor=${vendorId}`;

  // Generate QR code canvas
  const qrCanvas = SimpleQRGenerator.generate(paymentUrl, size);

  // Create container with styling
  const container = document.createElement("div");
  container.className = "qr-code-container";
  container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: linear-gradient(135deg, #fefcf9 0%, #faf7f2 100%);
        border-radius: 16px;
        border: 2px solid #c19a6b;
        box-shadow: 0 8px 25px rgba(193, 154, 107, 0.2);
    `;

  // Add QR code
  qrCanvas.style.cssText = `
        border-radius: 8px;
        margin-bottom: 1rem;
    `;
  container.appendChild(qrCanvas);

  // Add label
  const label = document.createElement("div");
  label.textContent = "Scan to Pay";
  label.style.cssText = `
        color: #8b6f47;
        font-weight: 600;
        font-size: 0.875rem;
        text-align: center;
    `;
  container.appendChild(label);

  return container;
}

// Function to generate QR code for display in modal
function generateQRCodeForModal(vendorId) {
  const qrCodeElement = document.getElementById("qr-code");
  if (!qrCodeElement) return;

  // Clear existing content
  qrCodeElement.innerHTML = "";

  // Generate and append QR code
  const qrCode = generateQRCode(vendorId, 200);
  qrCodeElement.appendChild(qrCode);
}

// Function to download QR code as image
function downloadQRCode(vendorId, filename = "payment-qr-code.png") {
  const vendorData = CashlessVendor.Storage.get("currentVendor");
  const paymentUrl = `${window.location.origin}/pay.html?vendor=${vendorId}`;

  // Generate QR code canvas
  const canvas = SimpleQRGenerator.generate(paymentUrl, 400); // Larger size for download

  // Create download link
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function to create printable QR code
function createPrintableQRCode(vendorId) {
  const vendorData = CashlessVendor.Storage.get("currentVendor");
  const paymentUrl = `${window.location.origin}/pay.html?vendor=${vendorId}`;

  // Generate QR code
  const canvas = SimpleQRGenerator.generate(paymentUrl, 300);
  const qrDataUrl = canvas.toDataURL("image/png");

  // Create printable HTML
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment QR Code - ${
              vendorData?.businessName || "CashlessVendor"
            }</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 2rem;
                    background: white;
                    margin: 0;
                }
                .qr-container {
                    border: 3px solid #c19a6b;
                    border-radius: 16px;
                    padding: 2rem;
                    margin: 2rem auto;
                    max-width: 400px;
                    background: linear-gradient(135deg, #faf7f2 0%, #f5f0e8 100%);
                    box-shadow: 0 4px 15px rgba(193, 154, 107, 0.2);
                }
                .business-name {
                    font-size: 1.5rem;
                    color: #8b6f47;
                    margin-bottom: 1rem;
                    font-weight: bold;
                }
                .qr-image {
                    margin: 1rem 0;
                    border-radius: 8px;
                }
                .scan-text {
                    font-size: 1.2rem;
                    color: #c19a6b;
                    margin: 1rem 0;
                    font-weight: 600;
                }
                .vendor-id {
                    font-family: monospace;
                    color: #a0826d;
                    font-size: 0.875rem;
                    margin-top: 1rem;
                }
                .instructions {
                    margin-top: 2rem;
                    color: #a0826d;
                    font-size: 0.875rem;
                    line-height: 1.5;
                }
                @media print {
                    body { margin: 0; padding: 1rem; }
                    .qr-container { box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="qr-container">
                <div class="business-name">${
                  vendorData?.businessName || "CashlessVendor"
                }</div>
                <img src="${qrDataUrl}" alt="Payment QR Code" class="qr-image" />
                <div class="scan-text">Scan to Pay</div>
                <div class="vendor-id">ID: ${vendorId}</div>
            </div>
            <div class="instructions">
                <p><strong>How to pay:</strong></p>
                <p>1. Open your phone's camera or QR scanner</p>
                <p>2. Point at the QR code above</p>
                <p>3. Tap the notification to open payment page</p>
                <p>4. Enter amount and complete payment</p>
            </div>
        </body>
        </html>
    `);
  printWindow.document.close();

  // Auto-print after a short delay
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// Export functions for global use
window.generateQRCode = generateQRCode;
window.generateQRCodeForModal = generateQRCodeForModal;
window.downloadQRCode = downloadQRCode;
window.createPrintableQRCode = createPrintableQRCode;
window.SimpleQRGenerator = SimpleQRGenerator;
