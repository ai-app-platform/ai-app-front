// Error handling utilities for API calls

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Error messages in Persian
export const ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
  UNAUTHORIZED: 'دسترسی غیرمجاز. لطفاً دوباره وارد شوید.',
  NOT_FOUND: 'مورد درخواستی یافت نشد.',
  VALIDATION_ERROR: 'اطلاعات وارد شده معتبر نیست.',
  SERVER_ERROR: 'خطای داخلی سرور. لطفاً بعداً دوباره تلاش کنید.',
  TIMEOUT: 'زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.',
};

// Get user-friendly error message
export const getErrorMessage = (error: ApiError | null): string => {
  if (!error) return ERROR_MESSAGES.SERVER_ERROR;
  
  // Check if we have a predefined message
  if (ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  
  // Return the error message from backend or default
  return error.message || ERROR_MESSAGES.SERVER_ERROR;
};

// Check if error is a network error
export const isNetworkError = (error: ApiError | null): boolean => {
  return error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT';
};

// Check if error requires authentication
export const isAuthError = (error: ApiError | null): boolean => {
  return error?.code === 'UNAUTHORIZED' || error?.code === 'FORBIDDEN';
};

// Log error for debugging
export const logError = (error: ApiError | null, context?: string): void => {
  // Always log in development
  console.error(`[API Error${context ? ` - ${context}` : ''}]:`, error);
};
