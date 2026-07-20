package com.fintech.credit.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BehavioralDataDTO {

    @JsonProperty("avg_monthly_income")
    private Double avgMonthlyIncome;

    @JsonProperty("income_stability")
    private Double incomeStability;

    @JsonProperty("avg_monthly_expense")
    private Double avgMonthlyExpense;

    @JsonProperty("spending_ratio")
    private Double spendingRatio;

    @JsonProperty("savings_ratio")
    private Double savingsRatio;

    @JsonProperty("avg_balance")
    private Double avgBalance;

    @JsonProperty("min_balance")
    private Double minBalance;

    @JsonProperty("low_balance_days")
    private Integer lowBalanceDays;

    @JsonProperty("transaction_frequency")
    private Integer transactionFrequency;

    @JsonProperty("discretionary_spending_ratio")
    private Double discretionarySpendingRatio;

    @JsonProperty("expense_volatility")
    private Double expenseVolatility;
}
