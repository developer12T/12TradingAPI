const express = require('express');
const moment = require('moment');
const { Op, where } = require('sequelize');
// const axios = require('axios'); 
const getOrder12TIntoM3 = express.Router();
const axios = require('axios')
const { Order,OrderDetail,OrderHis,OrderDetailHis } = require('../model/Order');
const { orderMovement } = require('../model/Ordermovement');
const { Customer } = require('../model/Customer');
const { logTable } = require('../model/Logtable')
const { sequelize } = require('../config/database');
require('dotenv').config();

require('moment/locale/th');
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH:mm');

getOrder12TIntoM3.post('/getOrder12TIntoM3', async (req, res) => {

    const action = req.body.action
    const action2 = req.body.action2

    try {
        
    if(action2 == 'moveorder'){

          const data = await Order.findAll({
              where: {
                  [Op.or]: [
                      {   statusPrininvSuccess: '001' },
                      {   statusPrininvSuccess: '002' },
                      { statusprint: '001' },
                      { statusprint: '002' },
                  ],
                  totalprint:{
                      [Op.gte]: 1
                  }
              }
          });
     
          for (let i = 0; i < data.length; i++) {
              if(action == 'InsertM3'){
  
                  const dataOrder = await Order.findAll({where:{id:data[i].id}}) 
                  for (const order of dataOrder) {
                      await OrderHis.create(order.dataValues); 
                  }
                const dataDetailOrder = await OrderDetail.findAll({
                    attributes: { exclude: ['auto_id'] },
                    where: { id: data[i].id }
                  });
                  
                  for (const orderdetail of dataDetailOrder) {
                    await OrderDetailHis.create({
                            id: orderdetail.id ,
                            productid: orderdetail.productid,
                            sku:orderdetail.sku,
                            name:orderdetail.name,
                            procode:orderdetail.procode,
                            number:orderdetail.number,
                            pricepernumber:orderdetail.pricepernumber,
                            discount:orderdetail.discount,
                            discountamount:orderdetail.discountamount,
                            totalprice:orderdetail.totalprice,
                            producttype:orderdetail.producttype,
                            serialnolist:orderdetail.serialnolist,
                            expirylotlist:orderdetail.expirylotlist,
                            skutype:orderdetail.skutype,
                            bundleid:orderdetail.bundleid,
                            bundleitemid:orderdetail.bundleitemid,
                            bundlenumber:orderdetail.bundlenumber,
                            bundleCode:orderdetail.bundleCode,
                            bundleName:orderdetail.bundleName,
                            integrationItemId:orderdetail.integrationItemId,
                            integrationVariantId:orderdetail.integrationVariantId,

                    });
                  }
                  
                  await Order.destroy({ where: {id:data[i].id} });
                  await OrderDetail.destroy({ where: {id:data[i].id} });
                  await orderMovement.destroy({ where: {id:data[i].id} })
                  await logTable.create({number:data[i].number,action:`Insert Into M3 complete}`,createdAt:currentDate})
                 
              }
          }
  
          res.status(200).json(data) ;

    }else{

        const response = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/getOrderErp',{},{});
        const listid =  response.data

          const data4 = await Order.findAll({
              where: {
                  [Op.or]: [
                      {   statusPrininvSuccess: '001' },
                      {   statusPrininvSuccess: '002' },
                      { statusprint: '001' },
                      { statusprint: '002' },
                  ],
                  totalprint:{
                      [Op.gte]: 1
                  }
              }
          });

         const existingIds = listid.map(item => item.number);
          const newDataList = data4.filter(item => !existingIds.includes(item.number));
          const filteredDataList = [];
          for (const item of newDataList) {
            if (item.status !== "Voided") {
              filteredDataList.push(item);
            }
          }
  
          const data = filteredDataList
          const orders = [];
     
          for (let i = 0; i < data.length; i++) {
              const itemData = await OrderDetail.findAll({
                  attributes: ['productid', 'sku', 'name', 'number', 'pricepernumber', 'totalprice','procode'],
                  where: {
                      id: data[i].id
                  }
              });
      
              const cusdata = await Customer.findAll({
                  attributes: ['customername','customercode'],
                  where: {
                      customerid: data[i].customerid
                  }
              })
      
              const cuss = cusdata[0].customername;
              const cuscode = cusdata[0].customercode
              // console.log(itemData);
      
              // console.log(cuss)
              // var itskulist = listofdetail.sku.split('_')[1] ;
              const items = itemData.map(item => ({
                  productid: item.productid,
                  sku: item.sku.split('_')[0],
                  unit: item.sku.split('_')[1],
                  name: item.name,
                  number: item.number,
                  pricepernumber: item.pricepernumber,
                  totalprice: item.totalprice,
                  procode: item.procode
              }));
  
              const order = {
                  id: data[i].id,
                  // saleschannel: data[i].saleschannel,
                  orderdate: data[i].orderdate,
                  orderdateString: data[i].orderdateString,
                  cono:data[i].cono,
                  inv:data[i].invno,
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
                  customercode: cuscode,
                  item: items,
                  
              };
              orders.push(order);
  
              if(action == 'InsertM3'){
  
                  const dataOrder = await Order.findAll({where:{id:data[i].id}}) 
                  for (const order of dataOrder) {
                      await OrderHis.create(order.dataValues); 
                  }
                  const dataDetailOrder = await OrderDetail.findAll({where:{id:data[i].id}})
                  for (const orderdetail of dataDetailOrder) {
                      await OrderDetailHis.create(orderdetail.dataValues); 
                  }
  
                  await Order.destroy({ where: {id:data[i].id} });
                  await OrderDetail.destroy({ where: {id:data[i].id} });
                  await orderMovement.destroy({ where: {id:data[i].id} })
                 
              }
          }
  
          res.status(200).json(orders);
    }
   
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'An error occurred while fetching the data.' });
     }

  });  

module.exports = getOrder12TIntoM3;    