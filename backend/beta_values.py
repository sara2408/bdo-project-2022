import yfinance as yf

# Adapted from Philipp's code
def get_beta_value(isin: str):
    ticker = yf.Ticker(isin)
    stock_info = ticker.info

    beta = stock_info['beta'] if 'beta' in stock_info else None

    return beta