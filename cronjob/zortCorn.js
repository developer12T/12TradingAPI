// myCronJobFunction.js
async function zortCronFunc() {

    const token = jwt.sign(
      { username: 'systemm3' },
      process.env.TOKEN_KEY,
      { expiresIn: '2h' }) 

    const response = await axios.post(process.env.API_URL+'/zort/order/OrderManage/addOrder',{ token:token },{});
    // console.log('My cron job is running!');
  }
  
  module.exports = zortCronFunc;