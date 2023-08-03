const express = require('express');
const ItemManage = express.Router();

const fakeStock = require('../controller/fakeStock')
const Item = require('../controller/getItem')

ItemManage.use('/fakeStock',fakeStock);
ItemManage.use('/Item',Item);

module.exports = ItemManage;