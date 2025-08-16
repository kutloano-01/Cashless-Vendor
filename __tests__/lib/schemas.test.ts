import { 
  vendorRegistrationSchema, 
  paymentSchema, 
  bankAccountSchema,
  withdrawalSchema,
  ussdSchema,
  validateForm 
} from '@/lib/schemas'

describe('Validation Schemas', () => {
  describe('vendorRegistrationSchema', () => {
    it('should validate correct vendor registration data', () => {
      const validData = {
        businessName: 'Maria\'s Fresh Fruits',
        ownerName: 'Maria Rodriguez',
        phone: '+1 (555) 123-4567',
        location: 'Corner of Main St & 5th Ave',
        businessType: 'food' as const,
        description: 'Fresh, locally sourced fruits and vegetables'
      }

      const result = vendorRegistrationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid business name', () => {
      const invalidData = {
        businessName: 'A', // Too short
        ownerName: 'Maria Rodriguez',
        phone: '+1 (555) 123-4567',
        location: 'Corner of Main St & 5th Ave',
        businessType: 'food' as const
      }

      const result = vendorRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid phone number', () => {
      const invalidData = {
        businessName: 'Maria\'s Fresh Fruits',
        ownerName: 'Maria Rodriguez',
        phone: '123', // Too short
        location: 'Corner of Main St & 5th Ave',
        businessType: 'food' as const
      }

      const result = vendorRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid business type', () => {
      const invalidData = {
        businessName: 'Maria\'s Fresh Fruits',
        ownerName: 'Maria Rodriguez',
        phone: '+1 (555) 123-4567',
        location: 'Corner of Main St & 5th Ave',
        businessType: 'invalid' as any
      }

      const result = vendorRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('paymentSchema', () => {
    it('should validate correct payment data', () => {
      const validData = {
        amount: 25.50,
        vendorId: 'CV-ABC12345',
        paymentMethod: 'card' as const
      }

      const result = paymentSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject amount below minimum', () => {
      const invalidData = {
        amount: 0.005, // Below minimum
        vendorId: 'CV-ABC12345',
        paymentMethod: 'card' as const
      }

      const result = paymentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid vendor ID format', () => {
      const invalidData = {
        amount: 25.50,
        vendorId: 'INVALID-ID',
        paymentMethod: 'card' as const
      }

      const result = paymentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('bankAccountSchema', () => {
    it('should validate correct bank account data', () => {
      const validData = {
        accountNumber: '1234567890',
        routingNumber: '123456789',
        accountHolderName: 'Maria Rodriguez',
        bankName: 'First National Bank'
      }

      const result = bankAccountSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid account number', () => {
      const invalidData = {
        accountNumber: '123', // Too short
        routingNumber: '123456789',
        accountHolderName: 'Maria Rodriguez',
        bankName: 'First National Bank'
      }

      const result = bankAccountSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('validateForm utility', () => {
    it('should return success for valid data', () => {
      const validData = {
        amount: 25.50,
        vendorId: 'CV-ABC12345',
        paymentMethod: 'card'
      }

      const result = validateForm(paymentSchema, validData)
      expect(result.success).toBe(true)
      expect(result.data).toEqual(validData)
    })

    it('should return errors for invalid data', () => {
      const invalidData = {
        amount: 0, // Invalid
        vendorId: 'INVALID', // Invalid
        paymentMethod: 'invalid' // Invalid
      }

      const result = validateForm(paymentSchema, invalidData)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(Object.keys(result.errors!)).toContain('amount')
    })
  })
})
