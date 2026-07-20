class RuleEngine:
    """
    Implements standard business rules for lending based on transaction behavior.
    Provides hard rejects and risk flags independent of the ML model.
    """
    def __init__(self, min_income=8000, max_spending_ratio=0.95, max_low_balance_days=12):
        self.min_income = min_income
        self.max_spending_ratio = max_spending_ratio
        self.max_low_balance_days = max_low_balance_days

    def evaluate(self, user_data):
        """
        Evaluates a single user based on financial behavior rules.
        user_data: dict containing user attributes.
        Returns: (passed, flags)
        """
        flags = []
        passed = True

        # Rule 1: Hard Reject for very low average income
        if float(user_data.get('avg_monthly_income', 0)) < self.min_income:
            passed = False
            flags.append(f"Income below viable threshold (${self.min_income})")

        # Rule 2: High spending flag
        if float(user_data.get('spending_ratio', 0)) > self.max_spending_ratio:
            flags.append(f"High-risk spending behavior warning (> {self.max_spending_ratio})")

        # Rule 3: Liquidity warning
        if int(user_data.get('low_balance_days', 0)) > self.max_low_balance_days:
            flags.append(f"Liquidity risk: Persistent low balance detected (> {self.max_low_balance_days} days)")

        return passed, flags

if __name__ == "__main__":
    engine = RuleEngine()
    test_user = {'avg_monthly_income': 9000, 'spending_ratio': 0.98, 'low_balance_days': 15}
    print("Test User Outcome:", engine.evaluate(test_user))
