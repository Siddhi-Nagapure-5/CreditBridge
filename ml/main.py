import os
import sys
import json

# Add local path 
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from inference import CreditInferenceEngine

def print_model_metrics():
    try:
        metadata_path = os.path.join(
            os.path.dirname(__file__),
            "models",
            "saved",
            "metadata.json"
        )

        with open(metadata_path, "r") as f:
            metadata = json.load(f)

        print("\n[MODEL METRICS]")
        print("-" * 60)
        print(f"Version       : {metadata.get('version', 'N/A')}")
        print(f"ROC-AUC       : {metadata.get('roc_auc', 'N/A')}")
        print(f"Accuracy      : {metadata.get('accuracy', 'N/A')}")
        print(f"Features Used : {len(metadata.get('features', []))}")

    except Exception as e:
        print("\n[WARNING] Could not load model metrics.")
        print(f"Reason: {e}")

def run_demonstration():
    print("="*60)
    print(" CREDITBRIDGE: TRANSACTION SCORING ENGINE DEMO ")
    print("="*60)

    # Print model metrics first
    print_model_metrics()

    try:
        engine = CreditInferenceEngine()
    except Exception as e:
        print(f"Failed to initialize engine: {e}")
        print("Tip: Have you run trainer.py yet?")
        return

    # A typical credit-invisible user with some transactional history
    test_user = {
        'avg_monthly_income': 9500,
        'income_stability': 0.88,
        'avg_monthly_expense': 4200,
        'spending_ratio': 0.65,
        'savings_ratio': 0.35,
        'avg_balance': 5400,
        'min_balance': 800,
        'low_balance_days': 4,
        'transaction_frequency': 120,   # High frequency -> better confidence
        'discretionary_spending_ratio': 0.3,
        'expense_volatility': 0.15
    }

    print(f"\n[USER PROFILE] Avg Income: ${test_user['avg_monthly_income']} | Transactions: {test_user['transaction_frequency']}")
    print("-" * 60)

    try:
        result = engine.predict_user_credit_score(test_user)
        
        if result['status'] == 'rejected':
            print(f"\n[REJECTED] {result['reason']}")
        else:
            print(f"\nCREDITBRIDGE SCORE: {result['score']} ({result['category']})")
            print(f"Outcome: {result['description']}")
            print(f"Confidence: {result['confidence_score'] * 100:.1f}%")
            print(f"Prob of Default: {result['probability_of_default']:.3f}")
            
            if result['flags']:
                print("\n[WARNING FLAGS]")
                for f in result['flags']:
                    print(f" - {f}")
            
            print("\n[EXPLAINABILITY - WHY THIS SCORE?]")
            print(f"Summary: {result['explainability_summary']}")
            for fact in result['top_factors']:
                impact_dir = "+" if fact['impact'] > 0 else ""
                print(f" - {fact['feature']}: {impact_dir}{fact['impact']:.4f}")
                
    except Exception as e:
         print(f"Error during prediction demo: {e}")

    print("\n" + "="*60)
    print(" DEMO COMPLETE ")
    print("="*60)

if __name__ == "__main__":
    run_demonstration()
