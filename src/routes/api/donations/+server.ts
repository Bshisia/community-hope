import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { donationsService } from '$lib/supabase';

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
    
    // In a real app, this would fetch from Supabase
    // const donations = projectId 
    //   ? await donationsService.getByProject(parseInt(projectId))
    //   : await donationsService.getAll();
    
    // For demo, return sample data
    const sampleDonations = [
      {
        id: 1,
        project_id: 1,
        amount: 5000,
        payment_method: 'mpesa',
        phone_number: '254712345678',
        transaction_id: 'MP123456789',
        status: 'completed',
        message: 'Keep up the great work!',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:35:00Z',
        projects: {
          name: 'Clean Water Initiative'
        }
      },
      {
        id: 2,
        project_id: 2,
        amount: 10000,
        payment_method: 'mpesa',
        phone_number: '254723456789',
        transaction_id: 'MP123456790',
        status: 'completed',
        message: 'Education is the key to success',
        created_at: '2024-01-14T15:20:00Z',
        updated_at: '2024-01-14T15:25:00Z',
        projects: {
          name: 'Education for All'
        }
      },
      {
        id: 3,
        project_id: 1,
        amount: 2500,
        payment_method: 'card',
        transaction_id: 'CC123456789',
        status: 'completed',
        created_at: '2024-01-13T09:15:00Z',
        updated_at: '2024-01-13T09:20:00Z',
        projects: {
          name: 'Clean Water Initiative'
        }
      }
    ];
    
    let filteredDonations = sampleDonations;
    
    if (projectId) {
      filteredDonations = filteredDonations.filter(d => d.project_id === parseInt(projectId));
    }
    
    return json({
      success: true,
      data: filteredDonations,
      total: filteredDonations.length
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
    
    // Create donation record
    const donationData = {
      project_id: body.project_id,
      amount: body.amount,
      payment_method: body.payment_method,
      phone_number: body.phone_number,
      transaction_id: '', // Will be updated after payment
      status: 'pending' as const,
      message: body.message
    };
    
    // In a real app, save to Supabase
    // const donation = await donationsService.create(donationData);
    
    // For demo, simulate creation
    const donation = {
      id: Date.now(),
      ...donationData,
      transaction_id: `TEMP_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
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
