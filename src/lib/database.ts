import Database from 'better-sqlite3';
import { dev } from '$app/environment';

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
  checkout_request_id?: string;
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

// Initialize database
const dbPath = dev ? 'community-hope.db' : '/tmp/community-hope.db';
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
function initializeDatabase() {
  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      target_amount INTEGER NOT NULL CHECK (target_amount > 0),
      raised_amount INTEGER DEFAULT 0 CHECK (raised_amount >= 0),
      category TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Donations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL CHECK (amount > 0),
      payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card')),
      phone_number TEXT,
      transaction_id TEXT UNIQUE,
      checkout_request_id TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
    CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
    CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
    CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
    CREATE INDEX IF NOT EXISTS idx_donations_transaction_id ON donations(transaction_id);
    CREATE INDEX IF NOT EXISTS idx_donations_checkout_request_id ON donations(checkout_request_id);
  `);

  // Insert sample data if tables are empty
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  
  if (projectCount.count === 0) {
    insertSampleData();
  }
}

function insertSampleData() {
  // Sample projects
  const insertProject = db.prepare(`
    INSERT INTO projects (name, description, image_url, target_amount, raised_amount, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const projects = [
    [
      "Clean Water Initiative",
      "Providing clean and safe drinking water to rural communities through well drilling and water purification systems.",
      "https://images.unsplash.com/photo-1509316785289-025f5b8b4dd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      1000000,
      654320,
      "Health"
    ],
    [
      "Education for All",
      "Building schools and providing educational materials for children in underserved areas to ensure access to quality education.",
      "https://images.unsplash.com/photo-1523050854058-8df90120c54f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      2500000,
      1234567,
      "Education"
    ],
    [
      "Food Relief Program",
      "Distributing nutritious meals to families affected by drought and food insecurity across the region.",
      "https://images.unsplash.com/photo-1514539079131-061a37729f30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      750000,
      432100,
      "Health"
    ],
    [
      "Youth Skills Training",
      "Vocational training programs to equip young people with marketable skills for employment and entrepreneurship.",
      "https://images.unsplash.com/photo-1549920294-7620e61c87fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      500000,
      187650,
      "Employment"
    ],
    [
      "Healthcare Outreach",
      "Mobile clinics providing medical services, vaccinations, and health education to remote communities.",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      1200000,
      876540,
      "Health"
    ],
    [
      "Reforestation Project",
      "Planting trees and educating communities about environmental conservation to combat climate change.",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      850000,
      321098,
      "Environment"
    ]
  ];

  for (const project of projects) {
    insertProject.run(...project);
  }

  // Sample admin user (password: password123)
  const insertAdmin = db.prepare(`
    INSERT INTO admin_users (email, password_hash)
    VALUES (?, ?)
  `);
  
  insertAdmin.run('admin@communityhope.com', '$2b$10$example_hash_here');

  // Sample donations
  const insertDonation = db.prepare(`
    INSERT INTO donations (project_id, amount, payment_method, transaction_id, status, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'))
  `);

  const donations = [
    [1, 5000, 'mpesa', 'MP123456789', 'completed', 1],
    [2, 10000, 'mpesa', 'MP123456790', 'completed', 2],
    [1, 2500, 'card', 'CC123456789', 'completed', 3],
    [3, 7500, 'mpesa', 'MP123456791', 'completed', 4],
    [2, 3000, 'mpesa', 'MP123456792', 'completed', 5],
    [4, 1500, 'mpesa', 'MP123456793', 'completed', 6],
    [5, 8000, 'card', 'CC123456790', 'completed', 7],
    [6, 4500, 'mpesa', 'MP123456794', 'completed', 8]
  ];

  for (const donation of donations) {
    insertDonation.run(...donation);
  }

  console.log('Sample data inserted successfully');
}

// Initialize database on import
initializeDatabase();

// Database services
export const projectsService = {
  getAll(): Project[] {
    const stmt = db.prepare(`
      SELECT * FROM projects 
      WHERE status = 'active' 
      ORDER BY created_at DESC
    `);
    return stmt.all() as Project[];
  },

  getById(id: number): Project | null {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    return stmt.get(id) as Project | null;
  },

  updateRaisedAmount(id: number, amount: number): void {
    const stmt = db.prepare(`
      UPDATE projects 
      SET raised_amount = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(amount, id);
  },

  incrementRaisedAmount(id: number, amount: number): void {
    const stmt = db.prepare(`
      UPDATE projects 
      SET raised_amount = raised_amount + ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(amount, id);
  }
};

// Export database instance for advanced queries if needed
export { db };
