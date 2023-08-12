
const express = require('express');
const moment = require('moment');
const { Op, where } = require('sequelize');
const axios = require('axios')
const { Sequelize,DataTypes,QueryTypes } = require('sequelize');
const updateCustomerInv = express.Router();

// const orderDataZort = require('../dataZort/allOrder');

const { Order, OrderDetail,OrderHis } = require('../model/Order') ;
const { Customer,ShippingAddress } = require('../model/Customer') ;
const { orderMovement } = require('../model/Ordermovement') ;
const { Product } = require('../model/Product')

const currentDate = moment().utcOffset(7).format('YYYY-MM-DD');
updateCustomerInv.put('/updateCustomerInv', async (req, res) => {
try {

    const sequelize = new Sequelize(process.env.databaseerp, process.env.user, process.env.password, {
        dialect: process.env.dialact,
        host: process.env.server, 
        });

    const data = await req.body.dataOrder
    // res.json(data)
        const orderTaxLazada = [];
        const orderTaxShopee = [] ;

          for (const item of data) {
            if (item.saleschannel === "Lazada") {
                orderTaxLazada.push(item)
            }else if(item.saleschannel === "Shopee"){
                orderTaxShopee.push(item);
            }
          }

          if(orderTaxLazada.length > 0){
            for(let i = 0;i<orderTaxLazada.length;i++){
                const response = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/getCustomerInv',{
                    customertype:'107',
                    customercode:'OLAZ'
                    }, {
                    headers: {
                    },
                });

                  function incrementCustomerCode(code) {
                    let number = parseInt(code, 10) + 1;
                    let newCode = number.toString();
                    while (newCode.length < code.length) {
                      newCode = '0' + newCode;
                    }
                    return newCode;
                  }

                const restdata = response.data[0] ;
                const customerCode = restdata.customercode;
                const numericPart = customerCode.slice(4);
                const newNumericPart = incrementCustomerCode(numericPart);
                const newCustomerCode = 'OLAZ' + newNumericPart;

                // const updatetozort = await axios.post(process.env.UpdateContact+`?id=60327271`,{code:'OSPE003008'}, {
               

                // const addressArray = new Array(4).fill('');
                const chunk1 = orderTaxLazada[i].customeraddress.substring(0, 35);
                const chunk2 = orderTaxLazada[i].customeraddress.substring(35, 70);
                const chunk3 = orderTaxLazada[i].customeraddress.substring(70, 105);
                const chunk4 = orderTaxLazada[i].customeraddress.substring(105, 140);

                const shchunk1 = orderTaxLazada[i].shippingaddress.substring(0, 35);
                const shchunk2 = orderTaxLazada[i].shippingaddress.substring(35, 70);
                const shchunk3 = orderTaxLazada[i].shippingaddress.substring(70, 105);
                const shchunk4 = orderTaxLazada[i].shippingaddress.substring(105, 140);

                const query = `
                INSERT INTO [dbo].[data_customer] (
                  companycode,customercode,customertype,searchkey,customername,address1,
                  address2,address3,address4,phone,salecode,ordertype,
                  warehouse,zone,payer,postcode,area,route,
                 shoptype,taxno,provincecode,
                  town,channel,status,insert_at) 
                VALUES (:value1,:value2,:value3,:value4,:value5,:value6,:value7,:value8,:value9,:value10,:value11,:value12,:value13,:value14,:value15,
                :value16,:value18,:value19,:value21,:value22,:value23,:value24,:value27,:value28,:value29)

                INSERT INTO [dbo].[data_address] (companycode,customercode,address1,address2,address3,address4, postcode,
                                                    provincecode,phone,taxno) 
                      VALUES (:value1,:value2,:value30,:value31,:value32,:value33,:value34,:value23,:value36,:value22)
                
                `;
    
                const replacements = { 
                    value1:410, value2:newCustomerCode, value3:'107',    value4: orderTaxLazada[i].customername.substring(0, 10), value5:orderTaxLazada[i].customername,                                                                              
                    value6: chunk1,     value7: chunk2,         value8: chunk3,         value9: chunk4, value10: orderTaxLazada[i].customerphone,                                                                          
                    value11: '11002',   value12: '071',         value13: '108',         value14: 'ON',  value15:'O00000001',                                   
                    value16:orderTaxLazada[i].customerpostcode,        value18:'ON101', value19:'R',                                   
                    value21: '',       value22: orderTaxLazada[i].customeridnumber,    value23:orderTaxLazada[i].customerpostcode.substring(0, 2), value24:'', 
                    value27:'ONLINE',value28:0,    value29: currentDate,   value30: shchunk1,  
                    value31: shchunk2,  value32: shchunk3,      value33: shchunk4,      value34: orderTaxLazada[i].shippingpostcode, value35: orderTaxLazada[i].shippingpostcode,                                                            
                    value36: orderTaxLazada[i].shippingphone, 
              }
              const result = await sequelize.query(query, {
                  replacements,
                  type: sequelize.QueryTypes.INSERT
              }); 
              console.log(result);
              const addCusm3 = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/addOnlineCustomerM3',{}, {});
              const updatetozort = await axios.post(process.env.UpdateContact+`?id=${orderTaxLazada[i].customerid}`,{code:newCustomerCode}, {
                headers: {
                    storename: process.env.zortstorename,
                    apikey: process.env.zortapikey,
                    apisecret: process.env.zortapisecret,
              
                  },
            });
            }
          
                // res.json(orderTaxLazada)
          }else if(orderTaxShopee.length > 0){
           for(let i = 0;i<orderTaxShopee.length;i++){
                const response = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/getCustomerInv',{
                    customertype:'107',
                    customercode:'OSPE'
                    }, {
                    headers: {
                    }, 
                });

                  function incrementCustomerCode(code) {
                    let number = parseInt(code, 10) + 1;
                    let newCode = number.toString();
                    while (newCode.length < code.length) {
                      newCode = '0' + newCode;
                    }
                    return newCode;
                  }

                const restdata = response.data[0] ;
                const customerCode = restdata.customercode;
                const numericPart = customerCode.slice(4);
                const newNumericPart = incrementCustomerCode(numericPart);
                const newCustomerCode = 'OSPE' + newNumericPart;

                // const updatetozort = await axios.post(process.env.UpdateContact+`?id=60327271`,{code:'OSPE003008'}, {
              

                // const addressArray = new Array(4).fill('');
                const chunk1 = orderTaxShopee[i].customeraddress.substring(0, 35);
                const chunk2 = orderTaxShopee[i].customeraddress.substring(35, 70);
                const chunk3 = orderTaxShopee[i].customeraddress.substring(70, 105);
                const chunk4 = orderTaxShopee[i].customeraddress.substring(105, 140);

                const shchunk1 = orderTaxShopee[i].shippingaddress.substring(0, 35);
                const shchunk2 = orderTaxShopee[i].shippingaddress.substring(35, 70);
                const shchunk3 = orderTaxShopee[i].shippingaddress.substring(70, 105);
                const shchunk4 = orderTaxShopee[i].shippingaddress.substring(105, 140);


              const query = `
                INSERT INTO [dbo].[data_customer] (
                  companycode,customercode,customertype,searchkey,customername,address1,
                  address2,address3,address4,phone,salecode,ordertype,
                  warehouse,zone,payer,postcode,area,route,
                 shoptype,taxno,provincecode,
                  town,channel,status,insert_at) 
                VALUES (:value1,:value2,:value3,:value4,:value5,:value6,:value7,:value8,:value9,:value10,:value11,:value12,:value13,:value14,:value15,
                :value16,:value18,:value19,:value21,:value22,:value23,:value24,:value27,:value28,:value29)

                INSERT INTO [dbo].[data_address] (companycode,customercode,address1,address2,address3,address4, postcode,
                                                    provincecode,phone,taxno) 
                      VALUES (:value1,:value2,:value30,:value31,:value32,:value33,:value34,:value23,:value36,:value22)
                
                `;
    
                const replacements = { 
                    value1:410, value2:newCustomerCode, value3:'107',    value4: orderTaxShopee[i].customername.substring(0, 10), value5:orderTaxShopee[i].customername,                                                                              
                    value6: chunk1,     value7: chunk2,         value8: chunk3,         value9: chunk4, value10: orderTaxShopee[i].customerphone,                                                                          
                    value11: '11002',   value12: '071',         value13: '108',         value14: 'ON',  value15:'O00000001',                                   
                    value16:orderTaxShopee[i].customerpostcode,        value18:'ON101', value19:'R',                                   
                    value21: '',       value22: orderTaxShopee[i].customeridnumber,    value23:orderTaxShopee[i].customerpostcode.substring(0, 2), value24:'', 
                    value27:'ONLINE',value28:0,    value29: currentDate,   value30: shchunk1,  
                    value31: shchunk2,  value32: shchunk3,      value33: shchunk4,      value34: orderTaxShopee[i].shippingpostcode, value35: orderTaxShopee[i].shippingpostcode,                                                            
                    value36: orderTaxShopee[i].shippingphone, 
              }
              const result = await sequelize.query(query, {
                  replacements,
                  type: sequelize.QueryTypes.INSERT
              }); 

              const addCusm3 = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/addOnlineCustomerM3',{}, {});
              const updatetozort = await axios.post(process.env.UpdateContact+`?id=${orderTaxShopee[i].customerid}`,{code:newCustomerCode}, {
                headers: {
                    storename: process.env.zortstorename,
                    apikey: process.env.zortapikey,
                    apisecret: process.env.zortapisecret,
              
                  },
            });

            }
                // res.json(orderTaxShopee)
            }

            res.json('success') 

} catch (error) {
    console.log(error)
    res.json(error)
}
})
module.exports = updateCustomerInv;
