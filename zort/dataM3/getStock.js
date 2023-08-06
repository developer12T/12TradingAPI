const axios = require('axios'); 
const stock = async (req,res) => {
  try {
    const response = await axios.post(process.env.m3apiurlgetstock, {
   
    },{});
      
    return response.data;
  } catch (error) {
    console.error(error);
    res.json({ error: 'Internal server error' });
  }
};

module.exports = stock; 