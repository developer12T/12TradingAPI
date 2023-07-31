const axios = require('axios');

const callRestApi = (token) => {
    axios.put('http://192.168.2.97:8383/zort/order/OrderManage/addOrder', 
    {}, 
    {
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
