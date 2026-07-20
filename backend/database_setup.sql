-- COMPLETE DATABASE SETUP SCRIPT
-- RUN THIS IN THE 'credit_scoring' DATABASE

-- 1. CLEANUP
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS banks CASCADE;

-- 2. CREATE BANKS TABLE
CREATE TABLE banks (
    id UUID PRIMARY KEY,
    bank_name VARCHAR(255) NOT NULL UNIQUE
);

-- 3. CREATE USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    bank_id UUID REFERENCES banks(id),
    is_password_changed BOOLEAN DEFAULT false
);

-- 4. CREATE REFRESH TOKENS TABLE
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 5. CREATE AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    action VARCHAR(255),
    details TEXT,
    performed_by VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SEED INITIAL DATA
INSERT INTO banks (id, bank_name) 
VALUES (gen_random_uuid(), 'Central Regulatory Authority');

-- Super Admin Account
-- Email: superadmin@creditbridge.com
-- Password: admin123
INSERT INTO users (id, name, email, password, role, is_password_changed)
VALUES (
    gen_random_uuid(), 
    'System Super Admin', 
    'superadmin@creditbridge.com', 
    '$2a$10$8.UnVuG9HHgffUDAlk8qnO6HmOEWkjBSOnW.76A6yWAgE.fVbw66C', 
    'SUPER_ADMIN', 
    true
);
