# TradingBotPractice
Created with CodeSandbox

Note: the backtesting library by Kendel Chopp uses an outdated call to getBars().  Alpaca changed their API so that getBars defaults to 100 bars and cannot be changed.  To get backtesting to work, the backtesting library will need amending to allow for more market data than just 100 1 minute bars.
