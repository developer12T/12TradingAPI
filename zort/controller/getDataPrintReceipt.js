const express = require('express');
const getDataPrintReceipt = express.Router();
const { Op } = require('sequelize');
const { Order,OrderDetail } = require('../model/Order')
const { Customer, ShippingAddress } = require('../model/Customer')
const { logTable } = require('../model/Logtable')
const sequelize = require('sequelize')
const axios = require('axios')
const moment = require('moment');
require('moment/locale/th');
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH:mm');
getDataPrintReceipt.post('/getDataPrintReceipt', async (req, res) => {
      
    try {
        const idOrder = req.body.list

        if(req.body.action == 'UpdateInvoiceOrder'){

          const orderDatup = await Order.findAll({where:{cono:1,id:idOrder}})

          if((orderDatup === null) || (orderDatup === undefined) || (orderDatup === '')){
          }else{
            
            var countUpdateorder = 0
              for(let i=0;i<orderDatup.length;i++){
                var numberser = await axios.post('http://192.168.2.97:8383/M3API/OrderManage/Order/getNumberSeries',{ 
                 series:'ง',
                 seriestype:'01', 
                 companycode:410,
                 seriesname:'071' 
                },{});
                 var invser = await axios.post(process.env.API_URL+'/M3API/OrderManage/Order/getInvNumber',{ 
                  ordertype:'071'
                },{});
                var invm3 = parseInt(invser.data[0].customerordno)
                const inv12T = await Order.findAll({attributes:['invno'],limit:1,order: [['invno', 'DESC']],})
              //   console.log(inv12T[0].invno);
                var inv12tcon = parseInt(inv12T[0].invno)
                if(invm3 > inv12tcon){
                  var inNo = (parseInt(invser.data[0].customerordno) );
                  var invnumber = inNo+1 ;
                }else{
                  var inNo = (inv12tcon + 1);
                  var invnumber = inNo ;
                }
                if(i == 0){
                  var seNo = (numberser.data[0].lastno+1);  
                }else{
                  var seNo = (numberser.data[0].lastno+i);  
                }
                var lastnumber = seNo ;
                console.log(lastnumber)
               const updateRun = await Order.update({cono:lastnumber,invno:invnumber},{where:{id:orderDatup[i].id}})
               await logTable.create({number:orderDatup[i].number,action:`run Inv : ${invnumber}`,action1:`run Co : ${lastnumber}`,createdAt:currentDate})
               countUpdateorder =  i
             } 

             console.log(countUpdateorder)
  
             var numberser2 = await axios.post('http://192.168.2.97:8383/M3API/OrderManage/Order/getNumberSeries',{ 
               series:'ง',
               seriestype:'01', 
               companycode:410,
               seriesname:'071' 
              },{});
     
             var updateNumber = await axios.post(process.env.API_URL+'/M3API/OrderManage/Order/updateNumberRunning',{ 
                 series:'ง',
                 seriestype:'01', 
                 companycode:410,
                 seriesname:'071',
                 lastno:numberser2.data[0].lastno+countUpdateorder+1
                }, {});
          }
             res.json('success')
        }else{

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
                attributes: ['productid','name','number','pricepernumber','totalprice','sku'],
                separate: false,
              },
              {
                model: ShippingAddress,
                required:false,
                attributes:['shippingaddress','shippingpostcode'],
                separate: false,
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
            await Order.update({statusPrininvSuccess:st,totalprint:ci},{where:{id:idOrder, status:{
              [Op.not]:'Voided'
          }}})
  
          }else{
            await Order.update({statusprint:st,totalprint:ci},{where:{id:idOrder, status:{
              [Op.not]:'Voided'
          }}})
          }
         if(req.body.action == 'lastRowActionToDataErp'){
  
           const response = await axios.post(process.env.API_URL+'/M3API/OrderManage/order/addOrderErp',{},{});
         }
         res.json(data)  
        }
        

        // 
        

           
    } catch (error) {
        console.log(error)
        res.json('error invalid data')
    }
}) ;


module.exports = getDataPrintReceipt;    