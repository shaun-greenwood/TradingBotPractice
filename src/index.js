require('dotenv').config();

const Alpaca = require('@alpacahq/alpaca-trade-api');

const alpaca = new Alpaca({
  keyId: 'APCA_API_KEY_ID',
  secretKey: 'APCA_API_SECRET_KEY',
  paper: true,
  usePolygon: false
});