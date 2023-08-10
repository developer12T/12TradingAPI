
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
const { Product } = require('../../model/Product')

require('moment/locale/th');
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH:mm');

cusStock.post('/cusStock', async (req, res) => {
try {
 
    const orderMoment = await orderMovement.findAll({where:{statusStock:'0'}})
    for(const list of orderMoment ){
      const detail = await OrderDetail.findAll({attributes:['sku','number'],where:{id:list.id}})
      for(const listofdetail of detail){
   
        const ctstock5 = await Product.findAll({
          attributes:['sku','stock'],
          where:{
            sku:listofdetail.sku
          }
        })
        for(const ctstock of ctstock5){
          const itcode = ctstock.sku
        var itcodeOnly = itcode.split('_')[0];
      
        const response = await axios.post(process.env.API_URL+'/M3API/ItemManage/Item/getItemConvert',{ itemcode:itcodeOnly }, {
                headers: {
                },
              });
                const restdata = response.data ;
                const ctstock2 = await Product.findAll({
                  attributes:['sku','stock'],
                  where:{
                    sku:{
                      [Op.like]: `%${itcodeOnly}%`
                  }}
                })

              for(const fstock of ctstock2){
               
                var fstockSku = fstock.sku 
                var itsku = fstockSku.split('_')[1] ;
              
               const restIns = restdata[0].type
                for(const restSku of restIns){
                 
                    if(itsku == restSku.unit){
                     
                      var itskulist = listofdetail.sku.split('_')[1] ; //pcs is not
                      if(itskulist == restSku.unit){
                        var cut_stock = (listofdetail.number * restSku.factor)
                      }
                    const pcsUnit = (restSku.factor * fstock.stock)
                      const qtysTOCK =  isNaN((pcsUnit - cut_stock) / restSku.factor) ? 0 : Math.max(0, Math.floor((pcsUnit - cut_stock) / restSku.factor));
                      const updateStock = await Product.update({stock:qtysTOCK},{where:{sku:fstock.sku}})
                       const updateMovment = await orderMovement.update({statusStock:1},{where:{id:list.id}})

                      var stocks = [
                        {
                          "sku": fstock.sku,
                          "stock": qtysTOCK,
                        //   "cost": 999
                        }
                      ]

                    //   const response =  axios.post('https://open-api.zortout.com/v4/Product/UpdateProductAvailableStockList?warehousecode=W0001', {stocks}, {
                    //     headers: headers,
                    //   });

                    //   const responseStock =  axios.post('https://open-api.zortout.com/v4/Product/UpdateProductStockList?warehousecode=W0001', {stocks}, {
                    //     headers: headers,
                    //   });
                     
                    }else if((itsku == 'PCS')||(itsku == 'BOT')||(itsku == 'Free')){
                        if((itskulist != 'PCS')||(itskulist != 'BOT')||(itskulist != 'Free')){
                          var cut_stock = (listofdetail.number * restSku.factor)
                        }else{
                          var cut_stock = listofdetail.number
                        }
                       
                        const pcsUnit = (fstock.stock)
                       
                        const qtysTOCK =  Math.max(0, Math.floor(pcsUnit - cut_stock));
                     
                       const updateStock = await Product.update({stock:qtysTOCK},{where:{sku:fstock.sku}})
                       const updateMovment = await orderMovement.update({statusStock:1},{where:{id:list.id}})

                       var stocks = [
                        {
                          "sku": fstock.sku,
                          "stock": qtysTOCK,
                        //   "cost": 999
                        }
                      ]

                    //   const response =  axios.post('https://open-api.zortout.com/v4/Product/UpdateProductAvailableStockList?warehousecode=W0001', {stocks}, {
                    //     headers: headers,
                    //   });

                    //   const responseStock =  axios.post('https://open-api.zortout.com/v4/Product/UpdateProductStockList?warehousecode=W0001', {stocks}, {
                    //     headers: headers,
                    //   });

                    }
                }
               
              }
      
       
        // const updateStock = await Product.update({stock:stockIns},{where:{sku:listofdetail.sku}})
        // const updateMovment = await orderMovement.update({statusStock:1},{where:{id:list.id}})
        }
        
      }
    }

    res.json('success')
    
} catch (error) {
    console.log(error)
    res.json(error)
}
})
module.exports = cusStock;
