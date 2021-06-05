require('dotenv').config(); // dotenv uses a seperate file to keep PI keys in

const Alpaca = require('@alpacahq/alpaca-trade-api'); // get alpaca API
const Backtest = require('@kendelchopp/alpaca-js-backtesting');

// connect to the API
const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secretKey: process.env.APCA_API_SECRET_KEY,
  paper: true,
  usePolygon: false
});

//create instance of back tester on alpaca using Kendel Chopp's code
const backtest = new Backtest({
  alpaca,
  startDate: new Date(2020, 1, 1, 0, 0),
  endDate: new Date(2020, 10, 11, 0, 0)
});

let accountCash;
let account;
const positionSize = 0.01;

//get the account from alpaca
async function setGlobals(){
  account = await alpaca.getAccount();
  accountCash = account.cash;
  console.log('1 percent of total cash = ' + accountCash*positionSize);
}

//perform setup
setGlobals();

