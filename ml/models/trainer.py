import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
import json
import os
import sys

# Add parent directory to path to import local modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from processing.data_cleaner import clean_data

def prepare_pipeline_and_train():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    ml_dir = os.path.dirname(current_dir)
    data_path = os.path.join(ml_dir, 'data', 'creditbridge_synthetic_dataset.csv')
    
    print("Loading transaction dataset...")
    df = pd.read_csv(data_path)
    df = clean_data(df)
    
    print("Applying dynamic target remapping to simulate real-world noise...")
    # Add advanced risk assignment logic instead of rule-based labels
    risk_score = (
        0.35 * df['spending_ratio'] +
        0.25 * df['income_stability'] +
        0.2 * (df['low_balance_days'] / 30) +
        0.1 * df['expense_volatility'] +
        0.1 * (1 - df['savings_ratio']) +
        np.random.normal(0, 0.05, size=len(df))
    )
    
    threshold = np.percentile(risk_score, 65)
    df['credit_risk'] = (risk_score > threshold).astype(int)
    
    # Define features and target (all basic numerical)
    features = [
        'avg_monthly_income', 'income_stability', 'avg_monthly_expense', 
        'spending_ratio', 'savings_ratio', 'avg_balance', 'min_balance', 
        'low_balance_days', 'transaction_frequency', 
        'discretionary_spending_ratio', 'expense_volatility'
    ]
    
    X = df[features]
    y = df['credit_risk']
    
    print("\nPerforming Stratified Train-Test Split...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    
    print("\n--- FEATURE SELECTION (On Training Data Only) ---")
    corr_matrix = X_train.corr().abs()
    upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
    
    # Identify features with high correlation > 0.85
    to_drop = []
    # Business critical features we NEVER drop even if highly correlated
    PROTECTED_FEATURES = ['spending_ratio', 'income_stability', 'low_balance_days']
    
    for column in upper.columns:
        if any(upper[column] > 0.85):
            if column not in PROTECTED_FEATURES:
                to_drop.append(column)
            else:
                print(f"Warning: {column} is highly correlated but protected from dropping.")
                
    if to_drop:
        print(f"Dropping correlated features: {to_drop}")
        X_train_fs1 = X_train.drop(columns=to_drop)
    else:
        X_train_fs1 = X_train.copy()
        
    print("Fitting initial XGBoost for Feature Importance...")
    initial_model = xgb.XGBClassifier(n_estimators=50, random_state=42)
    initial_model.fit(X_train_fs1, y_train)
    
    # Get top features
    importances = initial_model.feature_importances_
    feat_imps = pd.Series(importances, index=X_train_fs1.columns).sort_values(ascending=False)
    
    # Select top features (e.g. top 8 or all with > 0.01 importance)
    selected_cols = feat_imps[feat_imps > 0.01].index.tolist()
    
    # Ensure protected features are included
    for pf in PROTECTED_FEATURES:
        if pf not in selected_cols and pf in X_train_fs1.columns:
            selected_cols.append(pf)
            
    print(f"Selected purely beneficial features ({len(selected_cols)}): {selected_cols}")
    
    # Map selection back to sets
    X_train_final = X_train[selected_cols]
    X_test_final = X_test[selected_cols]
    
    print("\n--- MODEL TRAINING ---")
    
    # Handle Class Imbalance
    neg_class = (y_train == 0).sum()
    pos_class = (y_train == 1).sum()
    scale_pos_weight = float(neg_class / pos_class)
    print(f"Class Imbalance -> Negative: {neg_class}, Positive: {pos_class}. Scale Pos Weight: {scale_pos_weight:.2f}")

    final_model = xgb.XGBClassifier(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="logloss",
        scale_pos_weight=scale_pos_weight,
        random_state=42
    )
    
    final_model.fit(X_train_final, y_train)
    
    # Evaluate
    y_pred = final_model.predict(X_test_final)
    y_pred_proba = final_model.predict_proba(X_test_final)[:, 1]
    
    auc_score = roc_auc_score(y_test, y_pred_proba)
    print("\nEvaluation Metrics on Target Final Test Set:")
    print(classification_report(y_test, y_pred))
    print(f"ROC-AUC Score: {auc_score:.4f}")
    
    # Save Artifacts
    saved_dir = os.path.join(current_dir, 'saved')
    os.makedirs(saved_dir, exist_ok=True)
    
    # 1. Model native JSON
    model_path = os.path.join(saved_dir, 'model.json')
    final_model.save_model(model_path)
    
    # 2. Selected features list exact ordering
    features_path = os.path.join(saved_dir, 'selected_features.json')
    with open(features_path, 'w') as f:
        json.dump(selected_cols, f)
        
    # 3. Metadata tracking
    from datetime import datetime
    metadata = {
        "version": "v2_transaction_model",
        "date": datetime.now().isoformat(),
        "roc_auc": float(auc_score),
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "features_count": len(selected_cols),
        "features": selected_cols
    }
    
    metadata_path = os.path.join(saved_dir, 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print("\nSystem correctly mapped, modeled, evaluated and saved artifacts successfully.")
    
if __name__ == "__main__":
    prepare_pipeline_and_train()
