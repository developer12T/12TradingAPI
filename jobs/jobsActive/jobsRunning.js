const cron = require('node-cron');
const restApiJob_getOrder_zort = require('../restApiJob_getOrder_zort'); // เปลี่ยนตามที่คุณตั้งชื่อไฟล์
const token_jobs = require('../services/http_token')

// cron.schedule('*/5 * * * *', () => {
//   const token = token_jobs()
// //   console.log(token)
//   restApiJob_getOrder_zort(token);
//   console.log('Calling Rest API...');
// });