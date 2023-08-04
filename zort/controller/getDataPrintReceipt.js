const express = require('express');
const getDataPrintReceipt = express.Router();
const { Op } = require('sequelize');
const { Order,OrderDetail } = require('../model/Order')
const { Customer, ShippingAddress } = require('../model/Customer')
const sequelize = require('sequelize')

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

        res.json(data)      
    } catch (error) {
        console.log(error)
        res.json('error invalid data')
    }
}) ;


module.exports = getDataPrintReceipt;    