import { db, projectsService, type Donation } from './database.js';

export const donationsService = {
  create(donation: Omit<Donation, 'id' | 'created_at' | 'updated_at'>): Donation {
    const stmt = db.prepare(`
      INSERT INTO donations (
        project_id, amount, payment_method, phone_number, 
        transaction_id, checkout_request_id, status, message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      donation.project_id,
      donation.amount,
      donation.payment_method,
      donation.phone_number || null,
      donation.transaction_id,
      donation.checkout_request_id || null,
      donation.status,
      donation.message || null
    );
    
    return this.getById(result.lastInsertRowid as number)!;
  },

  getById(id: number): Donation | null {
    const stmt = db.prepare('SELECT * FROM donations WHERE id = ?');
    return stmt.get(id) as Donation | null;
  },

  updateStatus(id: number, status: Donation['status'], transactionId?: string): void {
    let stmt;
    if (transactionId) {
      stmt = db.prepare(`
        UPDATE donations 
        SET status = ?, transaction_id = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      stmt.run(status, transactionId, id);
    } else {
      stmt = db.prepare(`
        UPDATE donations 
        SET status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      stmt.run(status, id);
    }

    // If donation is completed, update project raised amount
    if (status === 'completed') {
      const donation = this.getById(id);
      if (donation) {
        projectsService.incrementRaisedAmount(donation.project_id, donation.amount);
      }
    }
  },

  getByProject(projectId: number): Donation[] {
    const stmt = db.prepare(`
      SELECT * FROM donations 
      WHERE project_id = ? AND status = 'completed' 
      ORDER BY created_at DESC
    `);
    return stmt.all(projectId) as Donation[];
  },

  getAll(): any[] {
    const stmt = db.prepare(`
      SELECT 
        d.*,
        p.name as project_name
      FROM donations d
      LEFT JOIN projects p ON d.project_id = p.id
      ORDER BY d.created_at DESC
    `);
    return stmt.all();
  },

  getStats() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as count,
        SUM(amount) as total,
        AVG(amount) as average
      FROM donations 
      WHERE status = 'completed'
    `);
    const result = stmt.get() as { count: number; total: number; average: number };
    
    // Get this month's donations
    const thisMonthStmt = db.prepare(`
      SELECT SUM(amount) as thisMonth
      FROM donations 
      WHERE status = 'completed' 
      AND date(created_at) >= date('now', 'start of month')
    `);
    const thisMonthResult = thisMonthStmt.get() as { thisMonth: number };
    
    return {
      total: result.total || 0,
      count: result.count || 0,
      average: result.average || 0,
      thisMonth: thisMonthResult.thisMonth || 0
    };
  },

  findByCheckoutRequestId(checkoutRequestId: string): Donation | null {
    const stmt = db.prepare('SELECT * FROM donations WHERE checkout_request_id = ?');
    return stmt.get(checkoutRequestId) as Donation | null;
  }
};

export const adminService = {
  authenticate(email: string, password: string): boolean {
    // Simple authentication for demo
    // In production, use proper password hashing
    return email === 'admin@communityhope.com' && password === 'password123';
  }
};
