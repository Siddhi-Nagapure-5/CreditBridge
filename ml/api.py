from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import os
import sys

# Add local path 
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from inference import CreditInferenceEngine

app = FastAPI(title="CreditBridge Behavioral ML Scoring API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For prototyping
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Engine Global
try:
    engine = CreditInferenceEngine()
except Exception as e:
    print(f"Warning: Engine initialization failed. Needs trainer.py. Details: {e}")
    engine = None

class BehavioralData(BaseModel):
    avg_monthly_income: float = Field(..., description="Average income per month")
    income_stability: float = Field(default=0.5, description="Income variance metric (0-1)")
    avg_monthly_expense: float = Field(..., description="Average expenses per month")
    spending_ratio: float = Field(..., description="Ratio of expenses to income")
    savings_ratio: float = Field(..., description="Ratio of savings to income")
    avg_balance: float = Field(..., description="Average account balance")
    min_balance: float = Field(..., description="Lowest account balance in period")
    low_balance_days: int = Field(default=0, description="Count of days with critically low balance")
    transaction_frequency: int = Field(..., description="Number of transactions in period")
    discretionary_spending_ratio: float = Field(default=0.2, description="Percentage of spending on non-essentials")
    expense_volatility: float = Field(default=0.1, description="Variance in expense habits")

@app.get("/health")
def health_check():
    is_ready = engine.is_ready if engine else False
    return {"status": "operational", "model_ready": is_ready}

@app.post("/api/score")
def generate_score(data: BehavioralData):
    if not engine or not engine.is_ready:
        raise HTTPException(status_code=503, detail="ML Models not generated yet. Run trainer.py")

    try:
        user_dict = data.dict()
        result = engine.predict_user_credit_score(user_dict)
        
        if result['status'] == 'rejected':
             return {
                 "status": "rejected",
                 "score": 300,
                 "category": "Rejected",
                 "description": result['reason'],
                 "flags": result.get('flags', [])
             }
             
        return {
            "status": "success",
            "score": result['score'],
            "category": result['category'],
            "description": result['description'],
            "probability_of_default": result['probability_of_default'],
            "confidence_score": result['confidence_score'],
            "flags": result['flags'],
            "max_loan_recommended": result['max_loan_recommended'],
            "max_loan_possible": result['max_loan_possible'],
            "explainability_summary": result['explainability_summary'],
            "top_factors": result['top_factors']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
