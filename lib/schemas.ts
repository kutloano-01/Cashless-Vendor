import { z } from "zod";

// Vendor Registration Schema
export const vendorRegistrationSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s&'-]+$/, "Business name contains invalid characters"),

  ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters")
    .max(50, "Owner name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Owner name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters"),

  location: z
    .string()
    .min(5, "Location must be at least 5 characters")
    .max(200, "Location must be less than 200 characters"),

  businessType: z.enum(
    ["food", "clothing", "electronics", "crafts", "services", "other"],
    {
      errorMap: () => ({ message: "Please select a valid business type" }),
    }
  ),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

// Payment Schema
export const paymentSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be at least R0.01")
    .max(10000, "Amount cannot exceed R10,000")
    .multipleOf(0.01, "Amount must be in cents"),

  vendorId: z.string().regex(/^CV-[A-Z0-9]{8}$/, "Invalid vendor ID format"),

  paymentMethod: z.enum(["card", "wallet"], {
    errorMap: () => ({ message: "Please select a valid payment method" }),
  }),
});

// Bank Account Schema for withdrawals
export const bankAccountSchema = z.object({
  accountNumber: z
    .string()
    .regex(/^\d{8,17}$/, "Account number must be 8-17 digits"),

  routingNumber: z.string().regex(/^\d{9}$/, "Routing number must be 9 digits"),

  accountHolderName: z
    .string()
    .min(2, "Account holder name must be at least 2 characters")
    .max(50, "Account holder name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Account holder name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  bankName: z
    .string()
    .min(2, "Bank name must be at least 2 characters")
    .max(100, "Bank name must be less than 100 characters"),
});

// Withdrawal Schema
export const withdrawalSchema = z.object({
  amount: z
    .number()
    .min(1, "Minimum withdrawal amount is R1")
    .max(50000, "Maximum withdrawal amount is R50,000")
    .multipleOf(0.01, "Amount must be in cents"),

  vendorId: z.string().regex(/^CV-[A-Z0-9]{8}$/, "Invalid vendor ID format"),
});

// USSD Code Schema
export const ussdSchema = z.object({
  code: z.string().regex(/^\*\d{3}\*\d+#$/, "Invalid USSD code format"),

  vendorId: z.string().regex(/^CV-[A-Z0-9]{8}$/, "Invalid vendor ID format"),
});

// Type exports for TypeScript
export type VendorRegistrationData = z.infer<typeof vendorRegistrationSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type BankAccountData = z.infer<typeof bankAccountSchema>;
export type WithdrawalData = z.infer<typeof withdrawalSchema>;
export type UssdData = z.infer<typeof ussdSchema>;

// Utility function for form validation
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "Validation failed" } };
  }
}
