
const express = require('express');
const moment = require('moment');
const { Op, where } = require('sequelize');
const axios = require('axios')

const updateCustomerInv = express.Router();

const orderDataZort = require('../dataZort/allOrder');

const { Order, OrderDetail,OrderHis } = require('../model/Order') ;
const { Customer,ShippingAddress } = require('../model/Customer') ;
const { orderMovement } = require('../model/Ordermovement') ;
const { Product } = require('../model/Product')


updateCustomerInv.put('/updateCustomerInv', async (req, res) => {

const data3 = await Order.findAll({where:{statusprintinv:'TaxInvoice'}})
        
for(let i=0;i<data3.length;i++){

  if(data3[i].saleschannel == 'Lazada'){
     // 1.ไปเรียกข้อมูลจาก M3 เพื่อ ข้อมูลล่าสุด
    const response = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/getCustomerInv',{
      customertype:'107',
      customercode:'OLAZ'
      }, {
      headers: {
      },
    });
    const restdata = response.data[0] ;

    // 2.เช็คว่า มี customeriderp ใน 12T customer ไหม
    // const cus12T = await Customer.findAll({where:{}})
    const cus12T = await Order.findAll({attributes:['id']},{ where:{statusprintinv:'TaxInvoice', customeriderp:{[Op.like]: `%OLAZ%`,} }})

    res.json(cus12T)

    //   const restdata = response.data ;
    //   const data4 = await Order.count({ where:{statusprintinv:'TaxInvoice', customeriderp:{[Op.like]: `%OLAZ%`,} }})

    //   if(data4 == 0){
    //     let numbersOnly = restdata[0].customercode.slice(4);
    //     let numbersPlusOne = String(parseInt(numbersOnly) + 1);
    //     // let finalResult = "OLAZ" + "00" + numbersPlusOne.padStart(numbersOnly.length, "0");
    //     let finalResult = "OLAZ" + "00" + numbersPlusOne;
    //     console.log(finalResult);
    //     await Customer.update({customercode:finalResult,customeriderp:2},{where:{customerid:data3[i].customerid}})
    //     await Order.update({customeriderp:finalResult},{where:{customerid:data3[i].customerid}})

    //   }else{

    //     const data5 = await Order.findAll({ 
    //       where:{
    //         statusprintinv:'TaxInvoice', 
    //         customeriderp:{
    //           [Op.like]: `%OLAZ%`
    //           ,} 
    //         },
    //           limit:1, 
    //           order: [['customeriderp', 'DESC']]

    //       })
    //       console.log(data5[0].customeriderp);

    //       let numbersOnly = data5[0].customeriderp.slice(4);
    //       let numbersPlusOne = String(parseInt(numbersOnly) + 1);
    //       let finalResult = "OLAZ" + "00" + numbersPlusOne;
    //       console.log(finalResult);

    //       await Customer.update({customercode:finalResult,customeriderp:2},{where:{customerid:data3[i].customerid}})
    //       await Order.update({customeriderp:finalResult},{where:{customerid:data3[i].customerid}})

    //   }
   
  }else if(data3[i].saleschannel == 'Shopee'){
    // const response = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/addCustomerInv',{
    //   customertype:'107',
    //   customercode:'OSPE'
    //   }, {
    //   headers: {
    //   },
    // });
    //   const restdata2 = response.data ;
    //   const data4 = await Order.count({ where:{statusprintinv:'TaxInvoice', customeriderp:{[Op.like]: `%OSPE%`,} }})

    //   if(data4 == 0){
    //     let numbersOnly = restdata2[0].customercode.slice(4);
    //     let numbersPlusOne = String(parseInt(numbersOnly) + 1);
    //     // let finalResult = "OLAZ" + "00" + numbersPlusOne.padStart(numbersOnly.length, "0");
    //     let finalResult = "OSPE" + "00" + numbersPlusOne;
    //     console.log(finalResult);
    //     await Customer.update({customercode:finalResult,customeriderp:1},{where:{customerid:data3[i].customerid}})
    //     await Order.update({customeriderp:finalResult},{where:{customerid:data3[i].customerid}})

    //   }else{

    //     const data5 = await Order.findAll({ 
    //       where:{
    //         statusprintinv:'TaxInvoice', 
    //         customeriderp:{
    //           [Op.like]: `%OSPE%`
    //           ,} 
    //         },
    //           limit:1, 
    //           order: [['customeriderp', 'DESC']]

    //       })
    //       console.log(data5[0].customeriderp);

    //       let numbersOnly = data5[0].customeriderp.slice(4);
    //       let numbersPlusOne = String(parseInt(numbersOnly) + 1);
    //       let finalResult = "OSPE" + "00" + numbersPlusOne;
    //       console.log(finalResult);

    //       await Customer.update({customercode:finalResult,customeriderp:1},{where:{customerid:data3[i].customerid}})
    //       await Order.update({customeriderp:finalResult},{where:{customerid:data3[i].customerid}})

    //   }
    //   const restdata = response.data ;
    res.json('cus12T')
  }
}

})
module.exports = updateCustomerInv;
