/**
 * Error handling utilities for the CashlessVendor application
 */

export interface AppError extends Error {
  code?: string
  statusCode?: number
  context?: Record<string, any>
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  QR_GENERATION_ERROR = 'QR_GENERATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class CashlessVendorError extends Error implements AppError {
  public code: string
  public statusCode: number
  public context: Record<string, any>

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    context: Record<string, any> = {}
  ) {
    super(message)
    this.name = 'CashlessVendorError'
    this.code = code
    this.statusCode = statusCode
    this.context = context
  }
}

/**
 * Create specific error types
 */
export class ValidationError extends CashlessVendorError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, context)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends CashlessVendorError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.NETWORK_ERROR, 0, context)
    this.name = 'NetworkError'
  }
}

export class PaymentError extends CashlessVendorError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.PAYMENT_ERROR, 402, context)
    this.name = 'PaymentError'
  }
}

export class QRGenerationError extends CashlessVendorError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.QR_GENERATION_ERROR, 500, context)
    this.name = 'QRGenerationError'
  }
}

/**
 * Error message mapping for user-friendly messages
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorCode.NETWORK_ERROR]: 'Network connection issue. Please check your internet connection.',
  [ErrorCode.PAYMENT_ERROR]: 'Payment processing failed. Please try again or use a different payment method.',
  [ErrorCode.QR_GENERATION_ERROR]: 'Unable to generate QR code. Please try again.',
  [ErrorCode.AUTHENTICATION_ERROR]: 'Authentication failed. Please log in again.',
  [ErrorCode.AUTHORIZATION_ERROR]: 'You don\'t have permission to perform this action.',
  [ErrorCode.NOT_FOUND_ERROR]: 'The requested resource was not found.',
  [ErrorCode.SERVER_ERROR]: 'Server error occurred. Please try again later.',
  [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error | AppError): string {
  if (error instanceof CashlessVendorError) {
    return ERROR_MESSAGES[error.code as ErrorCode] || error.message
  }
  
  // Handle common error patterns
  if (error.message.includes('fetch')) {
    return ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]
  }
  
  if (error.message.includes('validation') || error.message.includes('invalid')) {
    return ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR]
  }
  
  return ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]
}

/**
 * Log error with context
 */
export function logError(error: Error | AppError, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    context: {
      ...(error instanceof CashlessVendorError ? error.context : {}),
      ...context
    }
  }

  console.error('Application Error:', errorInfo)

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTrackingService(errorInfo)
  }
}

/**
 * Handle async operations with error handling
 */
export async function handleAsync<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<[T | null, Error | null]> {
  try {
    const result = await operation()
    return [result, null]
  } catch (error) {
    const appError = error instanceof Error ? error : new Error(String(error))
    
    if (errorMessage) {
      appError.message = errorMessage
    }
    
    logError(appError)
    return [null, appError]
  }
}

/**
 * Retry operation with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error | AppError): boolean {
  if (error instanceof CashlessVendorError) {
    return [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.SERVER_ERROR
    ].includes(error.code as ErrorCode)
  }
  
  // Check for common retryable error patterns
  const retryablePatterns = [
    'network',
    'timeout',
    'connection',
    'server error',
    '5'
  ]
  
  return retryablePatterns.some(pattern => 
    error.message.toLowerCase().includes(pattern)
  )
}

/**
 * Format error for display
 */
export function formatErrorForDisplay(error: Error | AppError): {
  title: string
  message: string
  code?: string
} {
  if (error instanceof CashlessVendorError) {
    return {
      title: getErrorTitle(error.code as ErrorCode),
      message: getUserFriendlyMessage(error),
      code: error.code
    }
  }
  
  return {
    title: 'Error',
    message: getUserFriendlyMessage(error)
  }
}

function getErrorTitle(code: ErrorCode): string {
  const titles: Record<ErrorCode, string> = {
    [ErrorCode.VALIDATION_ERROR]: 'Validation Error',
    [ErrorCode.NETWORK_ERROR]: 'Connection Error',
    [ErrorCode.PAYMENT_ERROR]: 'Payment Error',
    [ErrorCode.QR_GENERATION_ERROR]: 'QR Code Error',
    [ErrorCode.AUTHENTICATION_ERROR]: 'Authentication Error',
    [ErrorCode.AUTHORIZATION_ERROR]: 'Permission Error',
    [ErrorCode.NOT_FOUND_ERROR]: 'Not Found',
    [ErrorCode.SERVER_ERROR]: 'Server Error',
    [ErrorCode.UNKNOWN_ERROR]: 'Unexpected Error'
  }
  
  return titles[code] || 'Error'
}
