//require('dotenv').config(); // dotenv uses a seperate file to keep PI keys in
const EMA = require("technicalindicators").EMA; //library for indicators
const _ = require('lodash');//for mapping objects to arrays

const Alpaca = require("@alpacahq/alpaca-trade-api"); // get alpaca API
const Backtest = require("@kendelchopp/alpaca-js-backtesting");

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
  startDate: new Date(2015, 1, 1, 0, 0),
  endDate: new Date(2021, 1, 1, 0, 0)
});

let ema50, ema200;

//setup the exponential moving averages
async function initializeAverages() {
  const initialData = await alpaca.getBars(
    '1Min',
    'SPY',
    {
      limit: 200,
      until: new Date()
    }
  );

  const closeValues = _.map(initialData.SPY, (bar) => bar.closePrice);

  ema50 = new EMA({ period: 50, values: closeValues });
  ema200 = new EMA({ period: 200, values: closeValues });

  console.log(`sma20: ${ema50.getResult()}`);
  console.log(`sma50: ${ema200.getResult()}`);
}

initializeAverages();

//open stream
const client = backtest.data_ws;
client.onConnect(() => {
  console.log("opened backtest");
  client.subscribe(['AM.SPY']);
  setTimeout(()=>client.disconnect(), 600 * 1000);
});

client.onDisconnect(()=>{
  console.log(backtest.getStats());
});


//for some reason, it seems this must be called last
client.connect();

