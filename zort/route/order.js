const express = require('express');
const OrderManage = express.Router();
const router = express.Router();

const getOrder = require('../controller/getOrder')
const addOrder = require('../controller/addOrder')
const addOrderby = require('../controller/addOrderByDate')

OrderManage.use('/OrderManage',getOrder);
OrderManage.use('/OrderManage',addOrder);
OrderManage.use('/OrderManage',addOrderby);

module.exports = OrderManage;