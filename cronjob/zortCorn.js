// myCronJobFunction.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios')
async function zortCronFunc() {

    const token = jwt.sign(
      { username: 'systemm3' },
      process.env.TOKEN_KEY,
      { expiresIn: '2h' }) 

    const response = await axios.put('http://192.168.2.97:8383/zort/order/OrderManage/addOrderBydate',{ token:token },{});
    const response2 = await axios.put('http://192.168.2.97:8383/zort/order/OrderManage/updateStatusOrder',{ token:token },{});
    console.log(response.data);
    console.log(response2.data);
    
    // console.log(token);
  }
  
  module.exports = zortCronFunc;