const express = require('express');
const router = express.Router();

const OrderCashManage = require('./route/cash');

router.use('/CashOrder', OrderCashManage);

module.exports = router