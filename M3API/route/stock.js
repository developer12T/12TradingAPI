const express = require('express');
const StockManage = express.Router();

const fakeStock = require('../controller/fakeStock')
const Stock = require('../controller/getStock')

StockManage.use('/fakeStock',fakeStock);
StockManage.use('/Stock',Stock);

module.exports = StockManage;