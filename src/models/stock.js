const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  prices: { type: Array, required: true },
 
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
