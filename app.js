
//*******************  use lib  ************************************************************************ */
const express = require('express')
const cron = require('node-cron');
const cors = require('cors')
const auth = require('./authen/middleware/auth')
const app = express() ;

app.use(express.json())
app.use(cors())
//*******************  use lib  ************************************************************************ */

//*******************  import  ************************************************************************ */
//zort
const zort = require('./zort/index')

//M3API
const M3API = require('./M3API/index')

//authen
const loginToken = require('./authen/login')

//manageUser
const manageUser = require('./manageuser/index')

//job active 
const restApiJob_getOrder_zort = require('./jobs/restApiJob_getOrder_zort') 
//*******************  import  ************************************************************************ */

//*******************  end point  ************************************************************************ */
//zort
app.use('/zort',auth,zort)

// manageUser
app.use('/manageUser',manageUser)

//M3API
app.use('/M3API',M3API)

//authen
app.use('/12Trading',loginToken)

//*******************  end point  ************************************************************************ */

// job active
require('./jobs/jobsActive/jobsRunning');

module.exports = app