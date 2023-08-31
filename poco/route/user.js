const express = require('express');
const userManage = express.Router();

const addUser = require('../controller/addUser')

userManage.use('/userManage',addUser);

module.exports = userManage;