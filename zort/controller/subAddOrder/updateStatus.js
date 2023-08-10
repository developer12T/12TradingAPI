const express = require('express');

const { Op } = require('sequelize');

const updateStatusOrder = express.Router();

const orderDataZort = require('../../dataZort/orderUpdate');
const { Order,OrderHis } = require('../../model/Order') ;
require('moment/locale/th');

  updateStatusOrder.put('/updateStatusOrder', async (req, res) => {
 
    try {
          const dataOrder = await orderDataZort() ;
          const filteredList = dataOrder.list.filter(item => item.status !== 'Success').map(item => {
            return {
              "id": item.id,
              "status": item.status,
              "paymentstatus": item.paymentstatus
            };
          });

            
          const order = await Order.findAll({attributes:['id','status','paymentstatus']})
        res.json(filteredList)
      } catch (error) {
        console.log(error)
        res.status(500).json(error) 
      } 

  });  

module.exports = updateStatusOrder;    