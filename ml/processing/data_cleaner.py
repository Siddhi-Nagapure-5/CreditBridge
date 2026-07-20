import pandas as pd

def clean_data(df):
    """
    Cleans the transaction-based dataset by handling potential missing values
    for the behavioral features.
    """
    cleaned_df = df.copy()

    # The synthetic dataset is assumed clean, but safety boundaries ensure
    # robustness in inference and production
    
    # Fill NaNs with median for numerical columns just in case
    for col in cleaned_df.columns:
        if cleaned_df[col].dtype in ['float64', 'int64'] and col != 'user_id':
             # Use fillna instead of inplace for pandas compatibility
             cleaned_df[col] = cleaned_df[col].fillna(cleaned_df[col].median())
             
    # Drop user_id as it shouldn't be used in training or inference
    if 'user_id' in cleaned_df.columns:
        cleaned_df = cleaned_df.drop(columns=['user_id'])
        
    return cleaned_df
