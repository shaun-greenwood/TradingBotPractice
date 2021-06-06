class Strategy{
    constructor(account, symbol, riskRatio){
        this._account = account;
        this._symbol = symbol;
        this._riskRatio = riskRatio;
    }

    set account(account){
        this._account = account;
    }

    set symbol(symbol){
        this._symbol = symbol;
    }

    set riskRation(riskRatio){
        this._riskRatio = riskRatio;
    }

    async runStrategy(){
        //get market data

        //get technical indicators

        //perform logic

        //place order
    }
}