-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('monthly', 'weekly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category, period)
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

-- Create categories table for predefined categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    icon VARCHAR(50),
    color VARCHAR(20)
);

-- Insert default categories
INSERT INTO categories (name, type, icon, color) VALUES
    ('Salary', 'income', '💼', '#10b981'),
    ('Freelance', 'income', '💻', '#059669'),
    ('Investment', 'income', '📈', '#34d399'),
    ('Food & Dining', 'expense', '🍔', '#ef4444'),
    ('Transportation', 'expense', '🚗', '#f97316'),
    ('Shopping', 'expense', '🛍️', '#f59e0b'),
    ('Entertainment', 'expense', '🎬', '#ec4899'),
    ('Bills & Utilities', 'expense', '📄', '#8b5cf6'),
    ('Healthcare', 'expense', '🏥', '#06b6d4'),
    ('Education', 'expense', '📚', '#3b82f6'),
    ('Rent', 'expense', '🏠', '#6366f1'),
    ('Savings', 'expense', '💰', '#14b8a6')
ON CONFLICT (name) DO NOTHING;
