import QRCode from 'qrcode'

export interface QRCodeOptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(
  text: string, 
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M' as const
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    return await QRCode.toDataURL(text, mergedOptions)
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M' as const
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    return await QRCode.toString(text, { 
      type: 'svg',
      ...mergedOptions 
    })
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}

/**
 * Generate payment QR code URL
 */
export function generatePaymentURL(vendorId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/pay/${vendorId}`
}

/**
 * Generate QR code for vendor payment
 */
export async function generateVendorQRCode(
  vendorId: string,
  options: QRCodeOptions & { baseUrl?: string } = {}
): Promise<string> {
  const { baseUrl, ...qrOptions } = options
  const paymentUrl = generatePaymentURL(vendorId, baseUrl)
  
  return generateQRCode(paymentUrl, {
    width: 300,
    margin: 4,
    errorCorrectionLevel: 'H', // High error correction for payment QR codes
    ...qrOptions
  })
}

/**
 * Download QR code as PNG file
 */
export async function downloadQRCode(
  text: string,
  filename: string = 'qr-code.png',
  options: QRCodeOptions = {}
): Promise<void> {
  try {
    const dataUrl = await generateQRCode(text, options)
    
    // Create download link
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading QR code:', error)
    throw new Error('Failed to download QR code')
  }
}

/**
 * Validate QR code text content
 */
export function validateQRContent(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false
  }
  
  // Check if text is too long (QR codes have limits)
  if (text.length > 2953) { // Max for alphanumeric with error correction level L
    return false
  }
  
  return true
}

/**
 * Generate USSD code for vendor
 */
export function generateUSSDCode(vendorId: string): string {
  // Extract the alphanumeric part from vendor ID (e.g., CV-ABC12345 -> ABC12345)
  const idPart = vendorId.replace(/^CV-/, '')
  return `*123*${idPart}#`
}

/**
 * Format vendor ID for display
 */
export function formatVendorId(vendorId: string): string {
  if (!vendorId.startsWith('CV-')) {
    return `CV-${vendorId}`
  }
  return vendorId
}
