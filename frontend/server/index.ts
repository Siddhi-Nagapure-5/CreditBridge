import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';
import { generateFinancialInsights, analyzeLoanTerms } from './lib/gemini.js';
import { getTopNSEStocks } from './lib/stockApi.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware for protected routes
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- PROFILE & ANALYSIS ROUTES ---

app.post('/api/profile', authenticateToken, async (req: any, res) => {
  const { age, state, city, occupation, monthly_income, monthly_expenses, family_size, owns_house, goals } = req.body;
  const userId = req.user.userId;
  try {
    const result = await query(
      `INSERT INTO profiles (user_id, age, state, city, occupation, monthly_income, monthly_expenses, family_size, owns_house, goals) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       ON CONFLICT (user_id) DO UPDATE SET 
       age = $2, state = $3, city = $4, occupation = $5, monthly_income = $6, monthly_expenses = $7, family_size = $8, owns_house = $9, goals = $10
       RETURNING *`,
      [userId, age, state, city, occupation, monthly_income, monthly_expenses, family_size, owns_house, goals]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/insights', authenticateToken, async (req: any, res) => {
  try {
    const profile = await query('SELECT * FROM profiles WHERE user_id = $1', [req.user.userId]);
    const insights = await generateFinancialInsights(profile.rows[0]);
    res.json({ insights });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyze-loan', async (req, res) => {
  const { terms } = req.body;
  try {
    const analysis = await analyzeLoanTerms(terms);
    res.json({ analysis });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await getTopNSEStocks();
    res.json(stocks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
