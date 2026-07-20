import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateFinancialInsights = async (userData: any) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Analyze the following financial data for an Indian user and provide:
    1. A Financial personality type (e.g., The Guardian, The Spender, The Visionary).
    2. 3 key insights about their spending patterns.
    3. A 90-day action plan to improve their credit score and financial health.
    4. Eligibility explanation for government schemes based on their profile.

    User Data:
    ${JSON.stringify(userData, null, 2)}

    Format the response as a JSON object with keys: personality, insights (array), plan (array of objects with month and tasks), schemeExplanation.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if present
    text = text.replace(/```json|```/g, '').trim();
    
    try {
      return JSON.parse(text);
    } catch {
      return { error: 'Failed to parse AI response', raw: text };
    }
  } catch (error) {
    console.error('Gemini Error:', error);
    return null;
  }
};

export const analyzeLoanTerms = async (loanTerms: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Analyze these loan terms and identify predatory patterns, hidden charges, and compare them against RBI guidelines.
    Return a risk score (1-10), red flags (array), and safe alternatives (array).

    Loan Terms:
    ${loanTerms}

    Format as JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Error:', error);
    return null;
  }
};
