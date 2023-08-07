const express = require('express');
const OrderManage = express.Router();

const Order = require('../controller/getOrder')
const updateNumberRunning = require('../controller/updateNumberRunning')
const addOrderErp = require('../controller/addOrderErp')
const addCustomerInv = require('../controller/addCustomerInv')

OrderManage.use('/order',Order);
OrderManage.use('/order',updateNumberRunning);
OrderManage.use('/order',addOrderErp);
OrderManage.use('/order',addCustomerInv);

module.exports = OrderManage;