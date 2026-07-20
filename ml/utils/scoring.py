class CreditScorer:
    """
    Utility to map model probabilities to standard credit scores.
    Range: 300 to 900
    """
    @staticmethod
    def calculate_score(prob_default):
        """
        Inverts probability of default into a 300-900 score.
        Prob 0 -> 900
        Prob 1 -> 300
        """
        score = 300 + (1.0 - float(prob_default)) * 600
        return int(round(score))

    @staticmethod
    def categorize(score):
        """
        Segment scores into industry-standard categories.
        """
        if score >= 800:
            return "Exceptional", "Very low risk, highly likely to repay."
        elif score >= 700:
            return "Good", "Reliable borrower with stable financial behavior."
        elif score >= 600:
            return "Fair", "Moderate risk, sensitive to financial shocks."
        else:
            return "Risky", "High probability of default. Not recommended."

if __name__ == "__main__":
    scorer = CreditScorer()
    probs = [0.05, 0.2, 0.5, 0.9]
    for p in probs:
        s = scorer.calculate_score(p)
        cat, desc = scorer.categorize(s)
        print(f"Prob: {p:.2f} -> Score: {s} ({cat}) - {desc}")
