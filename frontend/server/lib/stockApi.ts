import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export const getTopNSEStocks = async () => {
  // Alpha Vantage uses symbols like 'RELIANCE.BSE' or 'TCS.BSE'
  // For a free tier, we might just fetch a few major ones
  const symbols = ['RELIANCE.BSE', 'TCS.BSE', 'HDFCBANK.BSE', 'INFY.BSE', 'ICICIBANK.BSE'];
  
  try {
    const stockPromises = symbols.map(symbol => 
      axios.get(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`)
    );
    
    const results = await Promise.all(stockPromises);
    return results.map(res => res.data['Global Quote']).filter(Boolean);
  } catch (error) {
    console.error('Alpha Vantage Error:', error);
    return [];
  }
};
