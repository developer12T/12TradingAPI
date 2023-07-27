const express = require('express');
const router = express.Router();

const ItemManage = require('./route/item');
const StockManage = require('./route/stock');


router.use('/ItemManage', ItemManage);
router.use('/StockManage', StockManage);

module.exports = router