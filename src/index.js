require('dotenv').config(); // dotenv uses a seperate file to keep PI keys in

const Alpaca = require('@alpacahq/alpaca-trade-api'); // get alpaca API

// connect to the API
const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secretKey: process.env.APCA_API_SECRET_KEY,
  paper: true,
  usePolygon: false
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

