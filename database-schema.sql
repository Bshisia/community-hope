-- Community Hope Database Schema
-- This file contains the SQL schema for setting up the database in Supabase

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    target_amount BIGINT NOT NULL CHECK (target_amount > 0),
    raised_amount BIGINT DEFAULT 0 CHECK (raised_amount >= 0),
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('mpesa', 'card')),
    phone_number VARCHAR(20), -- For M-Pesa payments
    transaction_id VARCHAR(255) UNIQUE,
    checkout_request_id VARCHAR(255), -- For M-Pesa STK push tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    message TEXT, -- Optional anonymous message
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_id ON donations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_donations_checkout_request_id ON donations(checkout_request_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at 
    BEFORE UPDATE ON donations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update project raised amount when donation is completed
CREATE OR REPLACE FUNCTION update_project_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- If donation status changed to completed, add to project raised amount
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE projects 
        SET raised_amount = raised_amount + NEW.amount,
            updated_at = NOW()
        WHERE id = NEW.project_id;
    END IF;
    
    -- If donation status changed from completed to failed/pending, subtract from project raised amount
    IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
        UPDATE projects 
        SET raised_amount = GREATEST(0, raised_amount - NEW.amount),
            updated_at = NOW()
        WHERE id = NEW.project_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update project raised amount
CREATE TRIGGER update_project_raised_amount_trigger
    AFTER UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_project_raised_amount();

-- Row Level Security Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access to projects
CREATE POLICY "Public can view active projects" ON projects
    FOR SELECT USING (status = 'active');

-- Public can insert donations (anonymous)
CREATE POLICY "Public can create donations" ON donations
    FOR INSERT WITH CHECK (true);

-- Public can view completed donations (for transparency, but no personal info)
CREATE POLICY "Public can view completed donations" ON donations
    FOR SELECT USING (status = 'completed');

-- Admin access (you'll need to implement proper admin authentication)
-- For now, we'll use a simple approach - in production, use proper JWT tokens

-- Sample data
INSERT INTO projects (name, description, image_url, target_amount, raised_amount, category) VALUES
('Clean Water Initiative', 'Providing clean and safe drinking water to rural communities through well drilling and water purification systems.', 'https://images.unsplash.com/photo-1509316785289-025f5b8b4dd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 1000000, 654320, 'Health'),
('Education for All', 'Building schools and providing educational materials for children in underserved areas to ensure access to quality education.', 'https://images.unsplash.com/photo-1523050854058-8df90120c54f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 2500000, 1234567, 'Education'),
('Food Relief Program', 'Distributing nutritious meals to families affected by drought and food insecurity across the region.', 'https://images.unsplash.com/photo-1514539079131-061a37729f30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 750000, 432100, 'Health'),
('Youth Skills Training', 'Vocational training programs to equip young people with marketable skills for employment and entrepreneurship.', 'https://images.unsplash.com/photo-1549920294-7620e61c87fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 500000, 187650, 'Employment'),
('Healthcare Outreach', 'Mobile clinics providing medical services, vaccinations, and health education to remote communities.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 1200000, 876540, 'Health'),
('Reforestation Project', 'Planting trees and educating communities about environmental conservation to combat climate change.', 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 850000, 321098, 'Environment');

-- Sample admin user (password: password123)
-- In production, use proper password hashing
INSERT INTO admin_users (email, password_hash) VALUES
('admin@communityhope.com', '$2b$10$example_hash_here');

-- Sample donations
INSERT INTO donations (project_id, amount, payment_method, transaction_id, status, created_at) VALUES
(1, 5000, 'mpesa', 'MP123456789', 'completed', NOW() - INTERVAL '1 day'),
(2, 10000, 'mpesa', 'MP123456790', 'completed', NOW() - INTERVAL '2 days'),
(1, 2500, 'card', 'CC123456789', 'completed', NOW() - INTERVAL '3 days'),
(3, 7500, 'mpesa', 'MP123456791', 'completed', NOW() - INTERVAL '4 days'),
(2, 3000, 'mpesa', 'MP123456792', 'completed', NOW() - INTERVAL '5 days');
