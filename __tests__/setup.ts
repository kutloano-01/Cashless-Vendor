// Test utilities and common setup
export const mockVendorData = {
  id: 'CV-TEST123',
  businessName: 'Test Business',
  ownerName: 'Test Owner',
  phone: '+1 (555) 123-4567',
  location: 'Test Location',
  businessType: 'food' as const,
  description: 'Test description'
}

export const mockPaymentData = {
  amount: 25.50,
  vendorId: 'CV-TEST123',
  paymentMethod: 'card' as const
}

export const mockBankAccountData = {
  accountNumber: '1234567890',
  routingNumber: '123456789',
  accountHolderName: 'Test Owner',
  bankName: 'Test Bank'
}

// Helper function to create mock form events
export const createMockEvent = (value: string) => ({
  target: { value },
  preventDefault: jest.fn(),
  stopPropagation: jest.fn()
})

// Helper function to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Mock implementations for common APIs
export const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
  readText: jest.fn().mockResolvedValue('')
}

export const mockNavigator = {
  clipboard: mockClipboard,
  share: jest.fn().mockResolvedValue(undefined)
}

// Setup function to reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks()
  mockClipboard.writeText.mockClear()
  mockClipboard.readText.mockClear()
  mockNavigator.share.mockClear()
}
