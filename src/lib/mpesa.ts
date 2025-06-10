// M-Pesa integration utilities
export interface MpesaPaymentRequest {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  checkoutRequestId?: string;
}

export interface MpesaCallbackData {
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

// Format phone number for M-Pesa (254XXXXXXXXX)
export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('254')) {
    return cleaned;
  } else if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    return '254' + cleaned;
  }
  
  return cleaned;
}

// Validate phone number
export function validatePhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Kenyan mobile numbers: 254 followed by 7XX, 1XX
  return /^254[71]\d{8}$/.test(formatted);
}

// Generate timestamp for M-Pesa API
export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Generate password for M-Pesa API
export function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  const data = shortcode + passkey + timestamp;
  // In a real implementation, you'd use btoa() or Buffer.from().toString('base64')
  return btoa(data);
}

// Validate amount
export function validateAmount(amount: number): boolean {
  return amount >= 1 && amount <= 150000; // M-Pesa limits
}

// Format amount for display
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Client-side payment initiation
export async function initiateMpesaPayment(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
  try {
    // Validate inputs
    if (!validatePhoneNumber(request.phone)) {
      return {
        success: false,
        message: 'Invalid phone number format'
      };
    }
    
    if (!validateAmount(request.amount)) {
      return {
        success: false,
        message: 'Amount must be between KES 1 and KES 150,000'
      };
    }
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(request.phone);
    
    // Call our API endpoint
    const response = await fetch('/api/mpesa/stk-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        phone: formattedPhone
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Payment initiation failed'
      };
    }
    
    return {
      success: true,
      message: 'Payment request sent. Please check your phone.',
      checkoutRequestId: data.checkoutRequestId,
      transactionId: data.transactionId
    };
    
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
}

// Check payment status
export async function checkPaymentStatus(checkoutRequestId: string): Promise<MpesaPaymentResponse> {
  try {
    const response = await fetch('/api/mpesa/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checkoutRequestId })
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      message: data.message,
      transactionId: data.transactionId
    };
    
  } catch (error) {
    console.error('Payment status check error:', error);
    return {
      success: false,
      message: 'Failed to check payment status'
    };
  }
}

// Simulate M-Pesa payment for demo purposes
export async function simulateMpesaPayment(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success/failure (90% success rate)
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      message: 'Payment completed successfully',
      transactionId: 'MP' + Date.now() + Math.floor(Math.random() * 1000),
      checkoutRequestId: 'ws_CO_' + Date.now()
    };
  } else {
    return {
      success: false,
      message: 'Payment failed. Please try again.'
    };
  }
}
