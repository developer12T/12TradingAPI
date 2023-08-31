const axios = require('axios'); 

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

const orderCashCN = async (req,res) => {
  try {

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    const response = await axios.get(process.env.tohomecash+'CNJsonData.aspx'+`?orderdate=${formattedDate}`, {});

    return response.data;
  } catch (error) {
    console.error(error);
    res.json({ error: 'Internal server error' });
  }
};

module.exports = orderCashCN;