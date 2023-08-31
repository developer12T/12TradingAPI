const express = require('express');
const orderCash = express.Router();

const addOrderCN = require('../controller/cash/addOrder')
const getOrderCN = require('../controller/cash/getOrder')

orderCash.use('/order',addOrderCN);
orderCash.use('/order',getOrderCN);

module.exports = orderCash;