const express = require('express');
const OrderManage = express.Router();
const router = express.Router();

const getOrder = require('../controller/getOrder')
const addOrder = require('../controller/addOrder')

OrderManage.use('/OrderManage',getOrder);
OrderManage.use('/OrderManage',addOrder);

module.exports = OrderManage;