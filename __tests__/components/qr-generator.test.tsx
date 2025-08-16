import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QRGenerator } from '@/components/qr-generator'

// Mock the QR utils
jest.mock('@/lib/qr-utils', () => ({
  generateVendorQRCode: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code'),
  downloadQRCode: jest.fn().mockResolvedValue(undefined),
  generatePaymentURL: jest.fn().mockReturnValue('http://localhost:3000/pay/CV-TEST123'),
  generateUSSDCode: jest.fn().mockReturnValue('*123*TEST123#')
}))

describe('QRGenerator', () => {
  const defaultProps = {
    vendorId: 'CV-TEST123',
    businessName: 'Test Business'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render QR generator component', () => {
    render(<QRGenerator {...defaultProps} />)
    
    expect(screen.getByText('Your Payment QR Code')).toBeInTheDocument()
    expect(screen.getByText('Customers can scan this code to pay you instantly')).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    render(<QRGenerator {...defaultProps} />)
    
    expect(screen.getByText('Generating QR code...')).toBeInTheDocument()
  })

  it('should display payment URL', () => {
    render(<QRGenerator {...defaultProps} />)
    
    expect(screen.getByText('Payment Link')).toBeInTheDocument()
    expect(screen.getByDisplayValue('http://localhost:3000/pay/CV-TEST123')).toBeInTheDocument()
  })

  it('should display USSD code', () => {
    render(<QRGenerator {...defaultProps} />)
    
    expect(screen.getByText('USSD Code (for basic phones)')).toBeInTheDocument()
    expect(screen.getByText('*123*TEST123#')).toBeInTheDocument()
  })

  it('should display vendor ID badge', () => {
    render(<QRGenerator {...defaultProps} />)
    
    expect(screen.getByText('CV-TEST123')).toBeInTheDocument()
  })

  it('should have download and share buttons', () => {
    render(<QRGenerator {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
  })

  it('should have copy buttons for URL and USSD', () => {
    render(<QRGenerator {...defaultProps} />)
    
    const copyButtons = screen.getAllByRole('button')
    const copyButtonsWithCopyIcon = copyButtons.filter(button => 
      button.querySelector('svg') && button.getAttribute('class')?.includes('shrink-0')
    )
    expect(copyButtonsWithCopyIcon.length).toBeGreaterThanOrEqual(2)
  })

  it('should show usage instructions', () => {
    render(<QRGenerator {...defaultProps} />)
    
    expect(screen.getByText('How to use:')).toBeInTheDocument()
    expect(screen.getByText('• Display this QR code at your stall')).toBeInTheDocument()
    expect(screen.getByText('• Customers scan with their phone camera')).toBeInTheDocument()
    expect(screen.getByText('• They enter the amount and pay')).toBeInTheDocument()
    expect(screen.getByText('• You get instant payment notifications')).toBeInTheDocument()
    expect(screen.getByText('• Basic phone users can dial the USSD code')).toBeInTheDocument()
  })

  it('should handle copy URL functionality', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    })

    render(<QRGenerator {...defaultProps} />)
    
    const copyButton = screen.getAllByRole('button').find(button => 
      button.querySelector('svg') && button.getAttribute('class')?.includes('shrink-0')
    )
    
    if (copyButton) {
      fireEvent.click(copyButton)
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled()
      })
    }
  })

  it('should call download function when download button is clicked', async () => {
    const { downloadQRCode } = require('@/lib/qr-utils')
    
    render(<QRGenerator {...defaultProps} />)
    
    // Wait for QR code to load
    await waitFor(() => {
      expect(screen.queryByText('Generating QR code...')).not.toBeInTheDocument()
    })
    
    const downloadButton = screen.getByRole('button', { name: /download/i })
    fireEvent.click(downloadButton)
    
    await waitFor(() => {
      expect(downloadQRCode).toHaveBeenCalled()
    })
  })
})

describe('QRGenerator - Error Handling', () => {
  const defaultProps = {
    vendorId: 'CV-TEST123',
    businessName: 'Test Business'
  }

  it('should display error message when QR generation fails', async () => {
    const { generateVendorQRCode } = require('@/lib/qr-utils')
    generateVendorQRCode.mockRejectedValueOnce(new Error('QR generation failed'))

    render(<QRGenerator {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to generate QR code')).toBeInTheDocument()
    })
  })

  it('should disable download button when QR code is not available', () => {
    render(<QRGenerator {...defaultProps} />)
    
    const downloadButton = screen.getByRole('button', { name: /download/i })
    expect(downloadButton).toBeDisabled()
  })
})
