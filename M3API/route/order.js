const express = require('express');
const OrderManage = express.Router();

const Order = require('../controller/getOrder')

OrderManage.use('/order',Order);

module.exports = OrderManage;