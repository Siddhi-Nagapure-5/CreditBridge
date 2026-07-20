-- CreditBridge PostgreSQL Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    state VARCHAR(100),
    city VARCHAR(100),
    occupation VARCHAR(100),
    monthly_income DECIMAL(12, 2),
    monthly_expenses DECIMAL(12, 2),
    family_size INTEGER,
    owns_house BOOLEAN DEFAULT FALSE,
    goals TEXT[], -- Array of strings for goals
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table (for simulation/analysis)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20), -- 'credit' or 'debit'
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Credit Scores Table
CREATE TABLE IF NOT EXISTS credit_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL CHECK (total_score >= 300 AND total_score <= 900),
    income_stability INTEGER,
    payment_behavior INTEGER,
    spending_discipline INTEGER,
    digital_volume INTEGER,
    savings_consistency INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schemes Matched Table
CREATE TABLE IF NOT EXISTS schemes_matched (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    scheme_name VARCHAR(255) NOT NULL,
    benefit_amount TEXT,
    match_percentage INTEGER,
    is_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Action Plans Table
CREATE TABLE IF NOT EXISTS action_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    month INTEGER NOT NULL,
    action TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loan Analyses Table
CREATE TABLE IF NOT EXISTS loan_analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    loan_amount DECIMAL(12, 2),
    interest_rate DECIMAL(5, 2),
    risk_score DECIMAL(3, 1),
    red_flags TEXT[], -- Array of strings
    analysis_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
