const express = require('express');
const router = express.Router();

const UserManage = require('./route/user');
const AddressManage = require('./route/address');

// const ProductManage = require('./route/product');
// const ZortRestApi = require('./route/zortRestApi');
// const syncdatabase = require('./controller/syncdatabase');

router.use('/user', UserManage);
router.use('/onetwo', AddressManage);

module.exports = router