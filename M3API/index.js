const express = require('express');
const router = express.Router();

const StockManage = require('./route/stock');
// const ProductManage = require('./route/product');
// const ZortRestApi = require('./route/zortRestApi');
// const syncdatabase = require('./controller/syncdatabase');


router.use('/StockManage', StockManage);
// router.use('/product', ProductManage);
// router.use('/rest12Tzort',ZortRestApi);
// router.use('/syncdatabase',syncdatabase);

module.exports = router