const express = require('express');
const fakeStock = express.Router();
fakeStock.post('/getStock', async(req,res)=>{

    try {
        const stock = [
            {
              itemcode: '10010702007',
              type: [
                {
                  factor: 6,
                  unit: 'BAG'
                },
                {
                  factor: 36,
                  unit: 'CTN'
                }
              ]
            },
          ];
          res.json(stock)
    } catch (error) {
        
    }
})


module.exports = fakeStock;    