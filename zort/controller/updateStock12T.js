const express = require('express');
const updateStock12T = express.Router();
const { Op } = require('sequelize');
const { Product } = require('../model/Product') ;

const stock = require('../dataM3/getStock')

updateStock12T.put('/updateStock12T', async (req, res) => { 
    try {
            // const findUpdate = await Product.findAll({attributes:['id','sku','stock']}) ;
        
            const data = await stock() ;

            const itemcodeToAvailableSum = {};

         
            data.forEach(item => {
            const { itemcode, available } = item;
            const trimmedItemcode = itemcode.trim(); 
            if (trimmedItemcode in itemcodeToAvailableSum) {
                itemcodeToAvailableSum[trimmedItemcode] += available;
            } else {
                itemcodeToAvailableSum[trimmedItemcode] = available;
            }
            });

            const result = Object.keys(itemcodeToAvailableSum).map(itemcode => ({
            itemcode,
            sumavailable: itemcodeToAvailableSum[itemcode]
            }));

        
        console.log(result.length);

        

        const response = await axios.post(process.env.API_URL+'/M3API/ItemManage/Item/getItemConvert',{ itemcode:itcodeOnly }, {
            headers: {
            },
          });
            const restdata = response.data ;


        // const getItem = await Product.findAll({
        //     attributes:['id','sku','stock'],
        //     where:{sku:{[Op.like]: `%${data[0].itemcode}%`}}})
        //     var sku_s = data[0].itemcode + "_" + data[0].type[1].unit ;
        //  const updateStock = await Product.update({stock:data[0].type[1].factor},{where:{sku:sku_s}})
       
        res.json(result)
    } catch (error) {
        res.status(500).json('Invalid data')
    }
})

module.exports = updateStock12T;    