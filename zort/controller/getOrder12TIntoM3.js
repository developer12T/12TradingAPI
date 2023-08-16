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
          if(action == 'InsertM3'){
          for (let i = 0; i < data.length; i++) {
  
                  const dataOrder = await Order.findAll({where:{id:data[i].id}}) 
                  for(const data2 of dataOrder){

                    const query = `
                    INSERT INTO [dbo].[orderSuccessInsM3] (id,[ordertype],[number],[customerid],[warehousecode],[status],[paymentstatus],[marketplacename],[marketplaceshippingstatus],[marketplacepayment],[amount],[vatamount] ,[shippingvat],[shippingchannel],
                    [shippingamount],[shippingdate],[shippingdateString],[shippingname],[shippingaddress] ,[shippingphone] ,[shippingemail],[shippingpostcode],[shippingprovince],[shippingdistrict] ,[shippingsubdistrict],[shippingstreetAddress],
                    [orderdate],[orderdateString],[paymentamount],[description],[discount],[platformdiscount],[sellerdiscount],[shippingdiscount],[discountamount],[voucheramount],[vattype],[saleschannel],[vatpercent],[isCOD],[createdatetime],
                    [createdatetimeString],[updatedatetime],[updatedatetimeString],[expiredate],[expiredateString],[receivedate],[receivedateString],[totalproductamount],[uniquenumber],[properties],[isDeposit],[statusprint],[statusprintINV],[statusPrininvSuccess],[cono],[invno],[customeriderp]) 
                    VALUES (:value1,:value2,:value3,:value4,:value5,:value6,:value7,:value8,:value9,:value10,:value11,:value12,:value13,:value14,:value15,:value16,:value17,:value18,:value19,:value20,:value21,:value22,:value23,:value24,:value25,
                    :value26,:value27,:value28,:value29,:value30,:value31,:value32,:value33,:value34,:value35,:value36,:value37,:value38,:value39,:value40,:value41,:value42,:value43,:value44,:value45,:value46,:value47,:value48,:value49,:value50,:value51,:value52,:value53,:value54,:value55,:value56,:value57,:value58)
                    
                    INSERT INTO [dbo].[orderMovement] (id, statusStock) VALUES (:value1, 0) 
                    `;

                    const replacements = { 
                        value1: data2.id,                        value11: data2.amount,             value21: data2.shippingemail,        value31: data2.discount,         value41: data2.createdatetime,       value51: data2.properties,
                        value2: data2.ordertype,                 value12: data2.vatamount,          value22: data2.shippingpostcode,     value32: data2.platformdiscount, value42: data2.createdatetimeString, value52: data2.isDeposit,
                        value3: data2.number,                    value13: data2.shippingvat,        value23: data2.shippingprovince,     value33: data2.sellerdiscount,   value43: data2.updatedatetime,       value53: '000',
                        value4: data2.customerid,                value14: data2.shippingchannel,    value24: data2.shippingdistrict,     value34: data2.shippingdiscount, value44: data2.updatedatetimeString, value54:'',
                        value5: data2.warehousecode,             value15: data2.shippingamount,     value25: data2.shippingsubdistrict,  value35: data2.discountamount,   value45: data2.expiredate,           value55:'000',
                        value6: data2.status,                    value16: data2.shippingdate,       value26: data2.shippingstreetAddress,value36: data2.voucheramount,    value46: data2.expiredateString,     value56:1,
                        value7: data2.paymentstatus,             value17: data2.shippingdateString, value27: data2.orderdate,            value37: data2.vattype,          value47: data2.receivedate,          value57:1,
                        value8: data2.marketplacename,           value18: data2.shippingname,       value28: data2.orderdateString,      value38: data2.saleschannel,     value48: data2.receivedateString,    value58:data2.customercode,
                        value9: data2.marketplaceshippingstatus, value19: data2.shippingaddress,    value29: data2.paymentamount,        value39: data2.vatpercent,       value49: data2.totalproductamount, 
                        value10: data2.marketplacepayment,       value20: data2.shippingphone,      value30: data2.description,          value40: data2.isCOD,            value50: data2.uniquenumber, 
                    }
                    const result = await sequelize.query(query, {
                        replacements,
                        type: sequelize.QueryTypes.INSERT
                    }); 
                

                  }

                  
                    //   await OrderHis.create(dataOrder.dataValues); 
                  
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