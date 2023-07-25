
const express = require('express')

const auth = require('./authen/middleware/auth')
const app = express() ;

app.use(express.json())

//zort
const zort = require('./zort/index')

//M3API
const M3API = require('./M3API/index')

//authen
const loginToken = require('./authen/login')

//zort
app.use('/zort',auth,zort)

//M3API
app.use('/M3API',auth,M3API)

//authen
app.use('/12Trading',loginToken)


module.exports = app