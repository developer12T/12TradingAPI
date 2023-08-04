const express = require('express');
const getDataPrintReceipt = express.Router();
const { Op } = require('sequelize');
const { Order,OrderDetail } = require('../model/Order')
const { Customer } = require('../model/Customer')
const sequelize = require('sequelize')

getDataPrintReceipt.post('/getDataPrintReceipt', async (req, res) => {
      
    try {
        const idOrder = req.body.list
        const data = await Order.findAll({
          attributes: ['id', 'number', 'amount', 'vatamount', 'shippingamount', 'orderdateString', 'discount', 'platformdiscount', 'sellerdiscount', 'shippingdiscount', 'discountamount', 'voucheramount'],
          where: {
            id:idOrder
          },
          include: [
            {
              model: Customer,
              required: true,
              attributes: ['customername', 'customeraddress','customeridnumber'],
            },
            {
              model: OrderDetail,
              required: true,
              attributes: ['productid','name','number','pricepernumber','totalprice'],
              separate: false,
            },
          ],
        });  

        res.json(data)      
    } catch (error) {
        console.log(error)
        res.json('error invalid data')
    }
}) ;


module.exports = getDataPrintReceipt;    