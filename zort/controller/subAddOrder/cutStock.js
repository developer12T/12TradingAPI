
const express = require('express');
const moment = require('moment');
const { Op, where } = require('sequelize');
const axios = require('axios')
const { Sequelize,DataTypes,QueryTypes } = require('sequelize');
const cusStock = express.Router();

// const orderDataZort = require('../dataZort/allOrder');

const { Order, OrderDetail,OrderHis } = require('../../model/Order') ;
const { Customer,ShippingAddress } = require('../../model/Customer') ;
const { orderMovement } = require('../../model/Ordermovement') ;
const { Product } = require('../../model/Product');
const { log } = require('console');

require('moment/locale/th');
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH:mm');

cusStock.post('/cusStock', async (req, res) => {
  const headers = {
    storename: process.env.zortstorename,
    apikey:  process.env.zortapikey,
    apisecret:  process.env.zortapisecret,
};
try {
  const cutter = [] 
  const bodycut = [] 
   const orderMoment = await orderMovement.findAll({where:{statusStock:'0'}})
   for(const orderId of orderMoment ){
    const item = await OrderDetail.findAll({attributes:['sku','number'],where:{id:orderId.id,sku:{
      [Op.not]:['DISONLINE_PCS','ZNS1401001_JOB']
    }}})
    for(const listofdetail of item){
      // console.log(listofdetail.sku+' : '+listofdetail.number);

      const itcode = listofdetail.sku
      var itcodeOnly = itcode.split('_')[0];
      var itskuOnly = itcode.split('_')[1];
 
      //1. ทำตัวที่ตัด ให้ เป็น หน่วยย่อยที่สุด
      const response = await axios.post(process.env.API_URL+'/M3API/ItemManage/Item/getItemConvertItemcode',{ itcode:itcodeOnly }, {});
      const restdata = response.data[0].type ;
      for(const typecon of restdata){
        if(typecon.unit === itskuOnly ){
          const cuuters = typecon.factor * listofdetail.number
          cutter.push(cuuters)
        }else if(itskuOnly === 'PCS' || itcodeOnly === 'BOT'){
          var pcsUnit = listofdetail.availablestock
          var facto = 1
          const cuuters = listofdetail.number
          cutter.push(cuuters)
        }
      }

      //2. เอา item ที่จะถูกต้องใน stock มา convert ให้เป็น pcs
      const stock12T = await Product.findAll({
        attributes:['sku','availablestock'],
        where:{
          sku:{
            [Op.like]:`%${itcodeOnly}%`
          }
        }
      })

      for(const converType of stock12T ){

        const response = await axios.post(process.env.API_URL+'/M3API/ItemManage/Item/getItemConvertItemcode',{ itcode:itcodeOnly }, {});
        const restdata = response.data[0].type ;
        var itskuOnly = converType.sku.split('_')[1];
        for(const typecon of restdata){
          if(typecon.unit === itskuOnly ){
            var pcsUnit = typecon.factor * converType.availablestock
            var facto =typecon.factor
            // cutter.push(cuuters)
          }else if(itskuOnly === 'PCS' || itcodeOnly === 'BOT'){
            var pcsUnit = converType.availablestock
            var facto = 1
          }
       }

        const datacon = {
          sku:converType.sku,
          stock:converType.availablestock,
          pcsUnit:pcsUnit,
          facto:facto
        }
        bodycut.push(datacon)
      }

      for(let i =0;i<bodycut.length;i++){

        // console.log(`${i} :`+bodycut[i].sku);
        // console.log(`${i} :`+bodycut[i].stock);
        // console.log(`${i} :`+bodycut[i].pcsUnit);
        // console.log(`${i} :`+bodycut[i].facto);

        
         var cut =bodycut[i].pcsUnit - cutter[0]
         var stocklast = cut / bodycut[i].facto
        //  console.log(`${i} : -`+ cutter[0]);
        //  console.log(`${i} : =`+stocklast);

        const stockTerm =parseInt(stocklast)

        var stocks = [
                {
                  "sku": bodycut[i].sku,
                  "stock": stockTerm,
                //   "cost": 999
                }
              ]

        const updateStock = await Product.update({availablestock:stockTerm},{where:{sku:bodycut[i].sku}})
        const response =  axios.post('https://open-api.zortout.com/v4/Product/UpdateProductAvailableStockList?warehousecode=W0001', {stocks}, {
                        headers: headers,
                      });
      }
      bodycut.splice(0, bodycut.length);
      cutter.splice(0, cutter.length);
    }
    const updateMovment = await orderMovement.update({statusStock:1},{where:{id:orderId.id}})
   
    
    
   }

   res.json(cutter)

} catch (error) {
    console.log(error)
    res.json(error)
}
})
module.exports = cusStock;
