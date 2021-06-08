//require('dotenv').config(); // dotenv uses a seperate file to keep PI keys in
const EMA = require("technicalindicators").EMA; //library for indicators
const _ = require("lodash"); //for mapping objects to arrays

const Alpaca = require("@alpacahq/alpaca-trade-api"); // get alpaca API
const Backtest = require("@kendelchopp/alpaca-js-backtesting");

const symbol = 'TSLA';

//store boolean to show whether the 50 is above the 200 or not
let above200 = false;

//debug counter
let i = 0;

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
  startDate: new Date(2020, 0, 0),
  endDate: new Date(2020, 0, 3)
});

let ema50, ema200;

/*
//setup the exponential moving averages
async function initializeAverages() {
  const initialData = await alpaca.getBars("1Min", symbol, {
    limit: 200,
    until: new Date()
  });

  console.log(initialData);

  const closeValues = _.map(initialData, (bar) => bar.closePrice);

  ema50 = new EMA({ period: 50, values: closeValues });
  ema200 = new EMA({ period: 200, values: closeValues });

  console.log(`ema50: ${ema50.getResult()}`);
  console.log(`ema200: ${ema200.getResult()}`);
}
*/

//initializeAverages();

//start the exponetial moving averages as empty
ema50 = new EMA({period: 50, values:[]});
ema200 = new EMA({period: 200, values: []});

//open stream
let client = backtest.data_ws;

client.onConnect(() => {
  console.log("opened backtest");
  client.subscribe(["AM."+symbol]);

  //the back testing library does not contain a disconnect method
  //setTimeout(() =>  client.disconnect(), 1000);
});

client.onDisconnect(() => {
  console.log(backtest.getStats());
});


//this code will run everytme a 1 min candle is formed
client.onStockAggMin((subject, data) => {
  //debug counter
  console.log('counter: ' + i + ', timestamp for candle: ' + data.startEpochTime + ', subject: ' + subject);
  console.log(client._startDate);
  console.log(client._endDate);

  //store the closing price of the last bar.
  const nextValue = data.closePrice;

  //use the closing price of the last bar to update the moving averages
  const next50 = ema50.nextValue(nextValue);
  const next200 = ema200.nextValue(nextValue);

  console.log('next50 = ' + next50 + ', next200 = ' + next200);
  if(!above200 && (next50 > next200)){
    above200 = true;
    console.log('50 EMA moved above 200 EMA');
  } else if(above200 && (next200 > next50)){
    above200 = false;
    console.log('50 EMA dropped below the 200 EMA');
  } else {
    console.log('something else happened');
  }

  i++;
});

//for some reason, it seems this must be called last
client.connect();
