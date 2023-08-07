const express = require('express');
const getDataPrintReceipt = express.Router();
const { Op } = require('sequelize');
const { Order,OrderDetail } = require('../model/Order')
const { Customer, ShippingAddress } = require('../model/Customer')
const sequelize = require('sequelize')
const axios = require('axios')
getDataPrintReceipt.post('/getDataPrintReceipt', async (req, res) => {
      
    try {
        const idOrder = req.body.list
        const data = await Order.findAll({
          attributes: ['id','cono','invno', 'number', 'amount','totalproductamount', 'vatamount', 'shippingamount', 'orderdateString', 'discount', 'platformdiscount', 'sellerdiscount', 'shippingdiscount', 'discountamount', 'voucheramount','saleschannel','statusprintinv'],
          where: {
            id:idOrder
          },
          include: [
            {
              model: Customer,
              required: false,
              attributes: ['customername', 'customeraddress','customeridnumber'],
            },
            {
              model: OrderDetail,
              required: false,
              attributes: ['productid','name','number','pricepernumber','totalprice'],
              separate: false,
            },
            {
              model: ShippingAddress,
              required:false,
              attributes:['shippingaddress']
            }
          ],
        });  
        const totalprint = await Order.findAll({attributes:['totalprint','statusprint','statusPrininvSuccess','statusprintinv'],where:{id:idOrder}})
        var ci = totalprint[0].totalprint+1
        if(totalprint[0].statusprint == '000'){
          var st = '001'
        }else if(totalprint[0].statusprint == '001'){
          var st = '002'
        }

        if(totalprint[0].statusprintinv == 'TaxInvoice'){
          if(totalprint[0].statusPrininvSuccess == '000'){
            var st = '001'
          }else if(totalprint[0].statusPrininvSuccess == '001'){
            var st = '002'
          }
          await Order.update({statusPrininvSuccess:st,totalprint:ci},{where:{id:idOrder}})

        }else{
          await Order.update({statusprint:st,totalprint:ci},{where:{id:idOrder}})
        }
       
        const response = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/addOrderErp',{},{});
        res.json(data)      
    } catch (error) {
        console.log(error)
        res.json('error invalid data')
    }
}) ;


module.exports = getDataPrintReceipt;    