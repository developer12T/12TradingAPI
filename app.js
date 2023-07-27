
const express = require('express')
const cors = require('cors')
const auth = require('./authen/middleware/auth')
const app = express() ;

app.use(express.json())
app.use(cors())
//zort
const zort = require('./zort/index')

//M3API
const M3API = require('./M3API/index')

//authen
const loginToken = require('./authen/login')

//manageUser
const manageUser = require('./manageuser/index')

//zort
app.use('/zort',auth,zort)

// manageUser
app.use('/manageUser',manageUser)

//M3API
app.use('/M3API',auth,M3API)

//authen
app.use('/12Trading',loginToken)


module.exports = app