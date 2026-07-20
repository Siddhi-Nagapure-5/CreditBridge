import pandas as pd

# The required behavioral features for the transaction model
BEHAVIOR_FEATURES = [
    'avg_monthly_income',
    'income_stability',
    'avg_monthly_expense',
    'spending_ratio',
    'savings_ratio',
    'avg_balance',
    'min_balance',
    'low_balance_days',
    'transaction_frequency',
    'discretionary_spending_ratio',
    'expense_volatility'
]

def engineer_features(df):
    """
    Validates and maps transaction behavioral features.
    No target remapping happens here to preserve separation of concerns.
    """
    feat_df = df.copy()
    
    # Ensure all required features exist, if not, set default to 0 for inference safety
    for col in BEHAVIOR_FEATURES:
        if col not in feat_df.columns:
            feat_df[col] = 0.0
            
    # We enforce bounds checking to prevent extreme data anomalies
    if 'spending_ratio' in feat_df.columns:
        feat_df['spending_ratio'] = feat_df['spending_ratio'].clip(lower=0.0, upper=2.0)
    
    if 'savings_ratio' in feat_df.columns:
         feat_df['savings_ratio'] = feat_df['savings_ratio'].clip(lower=-1.0, upper=1.0)
         
    # Return strictly the behavioral features to prevent noise/leakage
    return feat_df[BEHAVIOR_FEATURES]

if __name__ == "__main__":
    sample_data = pd.DataFrame({
        'avg_monthly_income': [5000, 8000],
        'spending_ratio': [0.8, 2.5], # 2.5 should be clipped
        'low_balance_days': [5, 12]
    })
    
    engineered = engineer_features(sample_data)
    print("Engineered Features Sample:")
    print(engineered)
