const express = require('express');
const getOrder = express.Router();
const { Op } = require('sequelize');
const { Order,OrderDetail } = require('../model/Order');
const { Customer } = require('../model/Customer');
const axios = require('axios')
async function M3WaitTab(res) {
    try {

        const response = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/getOrderErp',{ },{});
        const listid =  response.data
        const datapre = []
        const orders = [];
        for(let i =0;i<listid.length;i++){
      
          const dataindex = await Order.findAll({
              where: {
                  number:listid[i].number
              }
          });
      
          datapre.push(dataindex[0])
        }
      
      const data = datapre

          for (let i = 0; i < data.length; i++) {      
              const cusdata = await Customer.findAll({
                attributes: ['customername','customerid'],
                  where: {
                      customerid: '60155748'
                  }
              })
      
      
          
              const cuss = cusdata[0]?.customername || '';
            
              const order = {
                  id: data[i].id,
                  cono:data[i].cono,
                  invno:data[i].invno,
                  orderdate: data[i].orderdate,
                  orderdateString: data[i].orderdateString,
                  number: data[i].number,
                  customerid: data[i].customerid,
                  status: data[i].status,
                  paymentstatus: data[i].paymentstatus,
                  amount: data[i].amount,
                  vatamount: data[i].vatamount,
                  shippingchannel: data[i].shippingchannel,
                  shippingamount: data[i].shippingamount,
                  shippingstreetAddress: data[i].shippingstreetAddress,
                  shippingsubdistrict: data[i].shippingsubdistrict,
                  shippingdistrict: data[i].shippingdistrict,
                  shippingprovince: data[i].shippingprovince,
                  shippingpostcode: data[i].shippingpostcode,
                  createdatetime:data[i].createdatetime,
                  statusprint: data[i].statusprint,
                  totalprint:data[i].totalprint,
                  saleschannel: data[i].saleschannel,
                  customer: cuss,
              };
              orders.push(order);
          }
      
          return orders;
    } catch (error) {
        console.log(error);
        return { status: 'dataNotFound' };
    }
  }
  
  module.exports = M3WaitTab;