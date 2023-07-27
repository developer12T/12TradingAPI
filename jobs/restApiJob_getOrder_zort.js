const axios = require('axios');

const callRestApi = (token) => {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRoYW5hdG5vbi5qYWkiLCJpYXQiOjE2OTA0MjQxMTQsImV4cCI6MTY5MDQzMTMxNH0.0RgY0hV2sa-0Mpx-PEVE81QvIbBfnSOnqw88cT9lrZo';
    axios.put('http://192.168.2.97:8383/zort/order/OrderManage/addOrder', {}, {
      headers: {
        "x-access-token": token
      }
    })
      .then(response => {
        // console.log('Response:', response.data);
         console.log('Success:');
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
};
 
module.exports = callRestApi;
