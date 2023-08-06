const express = require('express');
const OrderManage = express.Router();
const router = express.Router();

const getOrder = require('../controller/getOrder')
const addOrder = require('../controller/addOrder')
const addOrderby = require('../controller/addOrderByDate')
const getDataPrintReceipt = require('../controller/getDataPrintReceipt')
const getOrder12TIntoM3 = require('../controller/getOrder12TIntoM3')

OrderManage.use('/OrderManage',getOrder);
OrderManage.use('/OrderManage',addOrder);
OrderManage.use('/OrderManage',addOrderby);
OrderManage.use('/OrderManage',getDataPrintReceipt);
OrderManage.use('/OrderManage',getOrder12TIntoM3);

module.exports = OrderManage;