const express = require('express');
const AddressManage = express.Router();

const manageAddress = require('../controller/manageAddress')

AddressManage.use('/action',manageAddress);

module.exports = AddressManage;