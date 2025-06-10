import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Project {
  id: number;
  name: string;
  description: string;
  image_url: string;
  target_amount: number;
  raised_amount: number;
  category: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: number;
  project_id: number;
  amount: number;
  payment_method: 'mpesa' | 'card';
  phone_number?: string;
  transaction_id: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
  last_login?: string;
}

// Database functions
export const projectsService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: number): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRaisedAmount(id: number, amount: number): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update({ 
        raised_amount: amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const donationsService = {
  async create(donation: Omit<Donation, 'id' | 'created_at' | 'updated_at'>): Promise<Donation> {
    const { data, error } = await supabase
      .from('donations')
      .insert({
        ...donation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: number, status: Donation['status'], transactionId?: string): Promise<void> {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (transactionId) {
      updateData.transaction_id = transactionId;
    }

    const { error } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  },

  async getByProject(projectId: number): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getAll(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        projects (
          name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getStats() {
    const { data: donations, error } = await supabase
      .from('donations')
      .select('amount, created_at')
      .eq('status', 'completed');
    
    if (error) throw error;
    
    const total = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const count = donations?.length || 0;
    const average = count > 0 ? total / count : 0;
    
    // Calculate this month's donations
    const now = new Date();
    const thisMonth = donations?.filter(d => {
      const donationDate = new Date(d.created_at);
      return donationDate.getMonth() === now.getMonth() && 
             donationDate.getFullYear() === now.getFullYear();
    }) || [];
    
    const thisMonthTotal = thisMonth.reduce((sum, d) => sum + d.amount, 0);
    
    return {
      total,
      count,
      average,
      thisMonth: thisMonthTotal
    };
  }
};

export const adminService = {
  async authenticate(email: string, password: string): Promise<boolean> {
    // In a real app, you'd hash the password and compare
    // For demo purposes, we'll use environment variables
    const adminEmail = 'admin@communityhope.com';
    const adminPassword = 'password123';
    
    return email === adminEmail && password === adminPassword;
  }
};
