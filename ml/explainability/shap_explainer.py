import shap
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
import os
import json

class CreditExplainer:
    def __init__(self, model_dir=None):
        """
        Loads the trained XGBoost model and the exact selected feature order.
        """
        if model_dir is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            model_dir = os.path.join(os.path.dirname(current_dir), 'models', 'saved')
            
        model_path = os.path.join(model_dir, 'model.json')
        features_path = os.path.join(model_dir, 'selected_features.json')
        
        # Load the feature list
        with open(features_path, 'r') as f:
            self.selected_features = json.load(f)
            
        # Load the XGBoost Classifier properly
        self.model = xgb.XGBClassifier()
        self.model.load_model(model_path)
        
        # SHAP TreeExplainer
        self.explainer = shap.TreeExplainer(self.model)

    def explain_prediction(self, input_df):
        """
        Explains a single prediction ensuring EXACT feature ordering.
        """
        # Strictly align feature order with training to prevent SHAP corruption
        # Any missing features should ideally be handled upstream, but we guarantee order here
        X_selected = pd.DataFrame(columns=self.selected_features)
        
        for col in self.selected_features:
            if col in input_df.columns:
                X_selected[col] = input_df[col]
            else:
                X_selected[col] = 0.0 # Safety fallback
                
        # Get SHAP values
        shap_values = self.explainer.shap_values(X_selected)
        
        # XGB binary classification usually returns one array or a list of two
        if isinstance(shap_values, list):
            vals = shap_values[1][0] if len(shap_values)>1 else shap_values[0][0]
        elif shap_values.ndim == 2:
            vals = shap_values[0]
        else:
             vals = shap_values
             
        if vals.ndim > 1:
            vals = vals[0]
            
        contributions = dict(zip(self.selected_features, vals))
        sorted_contributions = sorted(contributions.items(), key=lambda x: abs(x[1]), reverse=True)
        
        return sorted_contributions

    def get_summary_text(self, sorted_contributions, risk_probability):
        """
        Transforms internal SHAP values into user-friendly text based on transaction metrics.
        """
        reasons = []
        for feat, val in sorted_contributions[:3]:
            # Val > 0 increases probability of default (risk)
            impact = "increased" if val > 0 else "decreased"
            
            # User friendly mapping for transaction features
            name_map = {
                'spending_ratio': 'spending relative to income',
                'income_stability': 'income consistency',
                'low_balance_days': 'frequency of financial stress',
                'avg_monthly_income': 'average income level',
                'avg_monthly_expense': 'average expenses',
                'savings_ratio': 'savings habits',
                'avg_balance': 'average account balance',
                'min_balance': 'minimum account balance',
                'transaction_frequency': 'transaction activity',
                'discretionary_spending_ratio': 'non-essential spending',
                'expense_volatility': 'expense variability'
            }
            
            clean_name = name_map.get(feat, feat.replace('_', ' '))
            reasons.append(f"{impact.capitalize()} risk due to {clean_name}")
            
        # Add baseline context
        if risk_probability < 0.2:
            base_msg = "Overall strong financial profile. "
        elif risk_probability < 0.5:
            base_msg = "Moderate profile. "
        else:
            base_msg = "High risk profile. "
            
        summary = base_msg + ". ".join(reasons) + "."
        return summary
