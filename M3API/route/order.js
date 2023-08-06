const express = require('express');
const OrderManage = express.Router();

const Order = require('../controller/getOrder')
const updateNumberRunning = require('../controller/updateNumberRunning')
const addOrderErp = require('../controller/addOrderErp')

OrderManage.use('/order',Order);
OrderManage.use('/order',updateNumberRunning);
OrderManage.use('/order',addOrderErp);

module.exports = OrderManage;