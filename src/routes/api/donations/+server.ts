import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { donationsService } from '$lib/database-services.js';

interface CreateDonationRequest {
  project_id: number;
  amount: number;
  payment_method: 'mpesa' | 'card';
  phone_number?: string;
  message?: string;
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const projectId = url.searchParams.get('project_id');
    
    // Fetch donations from SQLite database
    let donations;
    if (projectId) {
      donations = donationsService.getByProject(parseInt(projectId));
    } else {
      donations = donationsService.getAll();
    }
    
    return json({
      success: true,
      data: donations,
      total: donations.length
    });
    
  } catch (error) {
    console.error('Error fetching donations:', error);
    return json(
      { success: false, message: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body: CreateDonationRequest = await request.json();
    
    // Validate request
    if (!body.project_id || !body.amount || !body.payment_method) {
      return json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate amount
    if (body.amount < 1 || body.amount > 150000) {
      return json(
        { success: false, message: 'Amount must be between 1 and 150,000 KES' },
        { status: 400 }
      );
    }
    
    // Validate phone number for M-Pesa
    if (body.payment_method === 'mpesa' && !body.phone_number) {
      return json(
        { success: false, message: 'Phone number is required for M-Pesa payments' },
        { status: 400 }
      );
    }
    
    // Create donation record in SQLite database
    const donationData = {
      project_id: body.project_id,
      amount: body.amount,
      payment_method: body.payment_method,
      phone_number: body.phone_number,
      transaction_id: `TEMP_${Date.now()}`, // Will be updated after payment
      status: 'pending' as const,
      message: body.message
    };
    
    const donation = donationsService.create(donationData);
    
    return json({
      success: true,
      data: donation,
      message: 'Donation record created successfully'
    });
    
  } catch (error) {
    console.error('Error creating donation:', error);
    return json(
      { success: false, message: 'Failed to create donation' },
      { status: 500 }
    );
  }
};
