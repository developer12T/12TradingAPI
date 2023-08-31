const express = require('express')

const auth = require('./authen/middleware/auth')
const app = express() ;
const cors = require('cors')
app.use(express.json())

  app.use(cors());

//zort
const zort = require('./zort/index')


const PurchaseCustomerOrder = require('./poco/index')

//M3API
const M3API = require('./M3API/index')

//authen
const loginToken = require('./authen/login')
const loginTokenAnt = require('./authen/loginAnt')
const addAnt = require('./authen/addAnt')
const devLoginToken = require('./authen/devlogin')
const checkToken = require('./authen/checkToken')

//manageUser
const manageUser = require('./manageuser/index')

//zort
app.use('/zort',auth,zort)
app.use('/PurchaseCustomerOrder',auth,PurchaseCustomerOrder)

// manageUser
app.use('/manageUser',manageUser)

//M3API
app.use('/M3API',M3API)

//authen
app.use('/12Trading',loginToken)
app.use('/12Trading',loginTokenAnt) 
app.use('/12Trading',addAnt) 
app.use('/12Trading',devLoginToken)
app.use('/12Trading',auth,checkToken)

// require('./cronjob/main');
 
module.exports = app