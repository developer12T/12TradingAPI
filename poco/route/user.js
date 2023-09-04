const express = require('express');
const userManage = express.Router();

const addUser = require('../controller/addUser')
const addCart = require('../controller/Cart')

userManage.use('/userManage',addUser);
userManage.use('/userManage',addCart);

module.exports = userManage;