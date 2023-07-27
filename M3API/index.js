const express = require('express');
const router = express.Router();

const ItemManage = require('./route/item');


router.use('/ItemManage', ItemManage);

module.exports = router