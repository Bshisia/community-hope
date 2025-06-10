import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { donationsService, projectsService } from '$lib/supabase';

interface MpesaCallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

interface CallbackMetadata {
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

function parseCallbackMetadata(items: Array<{ Name: string; Value: string | number }>): CallbackMetadata {
  const metadata: CallbackMetadata = {};
  
  for (const item of items) {
    switch (item.Name) {
      case 'Amount':
        metadata.amount = Number(item.Value);
        break;
      case 'MpesaReceiptNumber':
        metadata.mpesaReceiptNumber = String(item.Value);
        break;
      case 'TransactionDate':
        metadata.transactionDate = String(item.Value);
        break;
      case 'PhoneNumber':
        metadata.phoneNumber = String(item.Value);
        break;
    }
  }
  
  return metadata;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const callbackData: MpesaCallbackData = await request.json();
    
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));
    
    const { stkCallback } = callbackData.Body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;
    
    // Find the donation record by CheckoutRequestID
    // In a real app, you'd store the CheckoutRequestID when initiating the payment
    // and use it to find the corresponding donation record
    
    if (ResultCode === 0) {
      // Payment successful
      const metadata = stkCallback.CallbackMetadata 
        ? parseCallbackMetadata(stkCallback.CallbackMetadata.Item)
        : {};
      
      console.log('Payment successful:', {
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        amount: metadata.amount,
        receipt: metadata.mpesaReceiptNumber,
        phone: metadata.phoneNumber
      });
      
      // Update donation status in database
      // In a real implementation, you would:
      // 1. Find the donation record using CheckoutRequestID
      // 2. Update its status to 'completed'
      // 3. Update the project's raised amount
      // 4. Send confirmation notifications if needed
      
      /*
      try {
        // Find donation by checkout request ID
        const donation = await findDonationByCheckoutRequestId(CheckoutRequestID);
        
        if (donation) {
          // Update donation status
          await donationsService.updateStatus(
            donation.id, 
            'completed', 
            metadata.mpesaReceiptNumber
          );
          
          // Update project raised amount
          const project = await projectsService.getById(donation.project_id);
          if (project) {
            await projectsService.updateRaisedAmount(
              project.id, 
              project.raised_amount + donation.amount
            );
          }
        }
      } catch (error) {
        console.error('Error updating donation status:', error);
      }
      */
      
    } else {
      // Payment failed
      console.log('Payment failed:', {
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc
      });
      
      // Update donation status to failed
      /*
      try {
        const donation = await findDonationByCheckoutRequestId(CheckoutRequestID);
        if (donation) {
          await donationsService.updateStatus(donation.id, 'failed');
        }
      } catch (error) {
        console.error('Error updating failed donation status:', error);
      }
      */
    }
    
    // Always return success to M-Pesa to acknowledge receipt of callback
    return json({
      ResultCode: 0,
      ResultDesc: 'Callback received successfully'
    });
    
  } catch (error) {
    console.error('M-Pesa callback processing error:', error);
    
    // Still return success to M-Pesa to avoid retries
    return json({
      ResultCode: 0,
      ResultDesc: 'Callback received'
    });
  }
};

// Helper function to find donation by checkout request ID
// This would be implemented based on your database schema
/*
async function findDonationByCheckoutRequestId(checkoutRequestId: string) {
  // Implementation depends on how you store the checkout request ID
  // You might store it in a separate field or in metadata
  return null;
}
*/
