
const express = require('express');
const moment = require('moment');
const { Op, where } = require('sequelize');
const axios = require('axios')
const { Sequelize,DataTypes,QueryTypes } = require('sequelize');
const addDeatail = express.Router();

// const orderDataZort = require('../dataZort/allOrder');

const { Order, OrderDetail,OrderHis } = require('../../model/Order') ;
// const { Customer,ShippingAddress } = require('../model/Customer') ;
// const { orderMovement } = require('../model/Ordermovement') ;
// const { Product } = require('../model/Product')

// const currentDate = moment().utcOffset(7).format('YYYY-MM-DD');

addDeatail.post('/addDeatail', async (req, res) => {
try {
   const data = req.body.dataOrder

    if(data.sellerdiscount > 0){

      var itemDisOnline = await axios.post(process.env.API_URL+'/M3API/ItemManage/Item/getItemDisOnline',{ 
        itemtype:'ZNS',
        itemcode:'DISONLINE', 
      companycode:410,
    
     },{});

    //  var seNo = (numberser.data[0].lastno+i); 

      await OrderDetail.create({
        id:data.id,
        numberOrder:data.number,
        productid:8888888, //disonline
        name:itemDisOnline.data[0].itemname,
        sku:itemDisOnline.data[0].itemcode.trim()+'_PCS',
        number:1,
        unittext:'PCS',
        pricepernumber:data.sellerdiscount,
        totalprice:data.sellerdiscount
      })

    }
    
   
      if(data.saleschannel == 'Lazada'){
        if((data.shippingamount - data.discountamount) == 0){

        }else{
          await OrderDetail.create({id:data.id,  numberOrder:data.number,productid:9999999,name:'ค่าขนส่ง',sku:'ZNS1401001_JOB',number:1,totalprice:data.shippingamount,pricepernumber:data.shippingamount,unittext:'JOB'})
        }
      }else if(data.saleschannel == 'Shopee'){
        if(data.shippingamount == 0){

        }else{
          await OrderDetail.create({id:data.id,  numberOrder:data.number,productid:9999999,name:'ค่าขนส่ง',sku:'ZNS1401001_JOB',number:1,totalprice:data.shippingamount,pricepernumber:data.shippingamount,unittext:'JOB'})
        }
      }
    
    for(const list of data.list){
      // console.log(data.id) 
      const { auto_id, ...orderDatadetail } = list ; 
      orderDatadetail.id = data.id ;
      orderDatadetail.numberOrder = data.number
  
      await OrderDetail.bulkCreate([orderDatadetail])

      await OrderDetail.update({procode:'FV2F',pricepernumber:0,discount:0,discountamount:0},
      {where:{
        totalprice:0,
        sku:{
          [Op.ne]:'ZNS1401001'
        },
        productid:{
          [Op.ne]:'8888888'
        }
      }}) 
    }


    res.json(data)
    
} catch (error) {
    console.log(error)
    res.json(error)
}
})
module.exports = addDeatail;
