import pandas as pd
import numpy as np
import xgboost as xgb
import os
import sys
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from explainability.shap_explainer import CreditExplainer
from utils.scoring import CreditScorer
from utils.rules_engine import RuleEngine

class CreditInferenceEngine:
    def __init__(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_dir = os.path.join(current_dir, 'models', 'saved')
        
        self.model_path = os.path.join(model_dir, 'model.json')
        self.features_path = os.path.join(model_dir, 'selected_features.json')
        self.metadata_path = os.path.join(model_dir, 'metadata.json')
        
        self.is_ready = os.path.exists(self.model_path) and os.path.exists(self.features_path)
        
        if self.is_ready:
            self.model = xgb.XGBClassifier()
            self.model.load_model(self.model_path)
            
            with open(self.features_path, 'r') as f:
                self.selected_features = json.load(f)
                
            self.scorer = CreditScorer()
            self.rules = RuleEngine()
            self.explainer = CreditExplainer(model_dir=model_dir)

    def calculate_loan_limit(self, income, score, spending_ratio, savings_ratio, expense_volatility):
        """
        Calculates borrowing capacity based on DTI constraints and behavioral multipliers.
        """
        max_emi = 0.3 * income
        base_loan = max_emi * 30  # ~3-year term approximation with implicit interest

        multiplier = 1.0

        # Score adjustment
        if score >= 800:
            multiplier += 0.1
        elif score < 700:
            multiplier -= 0.2

        # Behavior adjustment
        if spending_ratio > 0.7:
            multiplier -= 0.2

        if savings_ratio > 0.4:
            multiplier += 0.1
            
        # Volatility penalty (New)
        if expense_volatility > 0.6:
            multiplier -= 0.1

        # Clamp multiplier to ensure realistic bounds [0.5, 1.2]
        multiplier = max(0.5, min(multiplier, 1.2))

        loan = base_loan * multiplier

        # Safety floor (e.g., at least 2x monthly income for viable candidates)
        loan = max(loan, income * 2)

        return round(loan, 2)

    def predict_user_credit_score(self, user_features_dict):
        """
        End-to-End Pipeline
        1. Checks Sufficiency
        2. Applies rules
        3. Formats dataframe
        4. Gets probability & Score
        5. Gets Explainability
        """
        if not self.is_ready:
            raise ValueError("Models not generated. Please run trainer.py first.")
            
        freq = float(user_features_dict.get('transaction_frequency', 0))
        
        # 1. Data Sufficiency
        if freq < 0:
            return {
                "status": "rejected",
                "reason": "Insufficient transaction data to model behavior reliably."
            }
            
        # Confidence logic: 100 transactions = 100% confidence
        confidence = min(1.0, freq / 100.0)
            
        # 2. Rule Engine filtering
        passed_rules, flags = self.rules.evaluate(user_features_dict)
        
        if freq < 30:
            flags.append("Low transaction history via LLM extraction — reduced confidence")
            
        if not passed_rules:
             return {
                "status": "rejected",
                "reason": "Failed basic viability rules: " + "; ".join(flags)
            }
             
        # 3. Predict Probability
        # Create single row DF
        df = pd.DataFrame([user_features_dict])
        
        # Ensure exact feature order for XGBoost inference
        X_infer = pd.DataFrame(columns=self.selected_features)
        for col in self.selected_features:
            X_infer[col] = [float(user_features_dict.get(col, 0.0))]
            
        # Infer
        prob_default = self.model.predict_proba(X_infer)[0][1]
        
        # 4. Convert score
        score = self.scorer.calculate_score(prob_default)
        cat, desc = self.scorer.categorize(score)
        
        # 5. Calculate Loan Limits (New Behavioral DTI logic)
        income = float(user_features_dict.get('avg_monthly_income', 0))
        spending_ratio = float(user_features_dict.get('spending_ratio', 0))
        savings_ratio = float(user_features_dict.get('savings_ratio', 0))
        expense_volatility = float(user_features_dict.get('expense_volatility', 0))
        
        max_loan_recommended = self.calculate_loan_limit(income, score, spending_ratio, savings_ratio, expense_volatility)
        max_loan_possible = round(max_loan_recommended * 1.2, 2)
        
        # 6. Explanations
        contribs = self.explainer.explain_prediction(X_infer)
        summary = self.explainer.get_summary_text(contribs, float(prob_default))
        
        return {
            "status": "success",
            "score": score,
            "category": cat,
            "description": desc,
            "probability_of_default": float(prob_default),
            "confidence_score": float(confidence),
            "flags": flags,
            "max_loan_recommended": max_loan_recommended,
            "max_loan_possible": max_loan_possible,
            "explainability_summary": summary,
            "top_factors": [{"feature": f, "impact": float(v)} for f, v in contribs[:3]]
        }

if __name__ == "__main__":
    engine = CreditInferenceEngine()
    
    test_user = {
        'avg_monthly_income': 9500,
        'income_stability': 0.85,
        'avg_monthly_expense': 4000,
        'spending_ratio': 0.42,
        'savings_ratio': 0.58,
        'avg_balance': 15000,
        'min_balance': 3000,
        'low_balance_days': 2,
        'transaction_frequency': 85,
        'discretionary_spending_ratio': 0.2,
        'expense_volatility': 0.1
    }
    
    try:
        result = engine.predict_user_credit_score(test_user)
        import json
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Failed to infer: {e}")
