const express = require('express');
const moment = require('moment');
const { Op, where } = require('sequelize');
const axios = require('axios')
const addOrder = express.Router();
const jwt = require('jsonwebtoken');

const orderDataZort = require('../dataZort/allOrder');

const { Order, OrderDetail,OrderHis } = require('../model/Order') ;
const { Customer,ShippingAddress } = require('../model/Customer') ;
const { orderMovement } = require('../model/Ordermovement') ;
const { Product } = require('../model/Product')

const { sequelize } = require('../config/database');
require('moment/locale/th');
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH:mm');
let createdCount = 0;
let createdShipCount = 0;
let updatedCount = 0;
const response = {
    status: '-- complete',
    dateTime: currentDate,
  };


addOrder.put('/addOrderBydate', async (req, res) => {
  const headers = {
    storename: process.env.zortstorename,
    apikey:  process.env.zortapikey,
    apisecret:  process.env.zortapisecret,
};
    try {

        // 1. ไปเรียกข้อมูลจาก Zort 
          const datapre = await orderDataZort() ;

        //2. อัปเดต ข้อมูลที่ได้มาจาก zort เพื่อปรับให้ lazada เหมือนกับ shopee
          const updatedData = datapre.list.map(data => {
            if (data.saleschannel === "Lazada" && (!data.tag || data.tag === "")) {
                data.customercode = "OLAZ000000";
            }
            return data;
        });

        //3. ตัวแปรที่จะมาเก็บ รายการใหม่ ที่ไม่มีใน his และ order
        const filteredDataList = [];

        //4. กรองข้อมูล ที่มี id ใน orderhis อยู่แล้วออก
          const existingIds = (await OrderHis.findAll()).map(item => item.id);
          const newDataList = updatedData.filter(item => !existingIds.includes(item.id));
        
        //5. กรองข้อมูล ที่มี id ใน order อยู่แล้วออก
          const existingIdsOrder = (await Order.findAll()).map(item => item.id);
          const newDataListOrder = newDataList.filter(item => !existingIdsOrder.includes(item.id));
          
        //6.ตัวแปรที่จะมาเก็บ ออเดอที่ไม่มี customercode 
          const orderTaxShopee = [] ;

        //7. ทำการแยก ออเดอ ระหว่าง มี customercode และไม่มี customercode แต่ ยังเอา id ที่มีใน order มาใช้และ insert
          for (const item of newDataListOrder) {
            if (item.status !== "Voided" && item.customercode === "") {
                orderTaxShopee.push(item)
            }else{
                filteredDataList.push(item);
            }
          }

        //8.สร้างตัวแปร token มาเพื่อใช้ยิงไปที่ updatecustomer
          const token = jwt.sign({ username: 'systemm3' },process.env.TOKEN_KEY,{ expiresIn: '2h' }) 
          
        //9. เอาตัวแปรที่ได้จาก 4. มาใช้ เพื่อ ให้ customercode ออเดอ อัพเดตใหม่
        // const response =  axios.put(process.env.API_URL+`/zort/customer/CustomerManage/updateCustomerInv?token=${token}`,{dataOrder:orderTaxShopee },{});

        //10. กำหนด data2 ให้เท่ากับ order ใหม่
          const data2 = filteredDataList;

            if(data2.length > 0){
        //11. ถ้ามีออเดอใหม่เข้ามา ให้ insert order และ orderDetail ของ order นั้น
              for(const addOrderData of data2){
                //11.1 ส่งข้อมูลไปทีละ order เพื่อ Insert
                const addOrder = await  axios.post(process.env.API_URL+`/zort/order/OrderManage/addOrderNew?token=${token}`,{dataOrder:addOrderData },{});

                 //11.2 ส่งข้อมูลไปทีละ orderDetail เพื่อ Insert
                const addOrderDetail = await  axios.post(process.env.API_URL+`/zort/order/OrderManage/addDeatail?token=${token}`,{dataOrder:addOrderData },{});

                //11.3 ส่งข้อมูลไปทีละออเดอ เพื่อ Insert
                const addCustomer = await  axios.post(process.env.API_URL+`/zort/order/OrderManage/addCustomer?token=${token}`,{dataOrder:addOrderData},{});

                //11.4 เมื่อ Insert ทุดอย่างแล้ว จะทำการตัดสต็อก
                const cutStock = await  axios.post(process.env.API_URL+`/zort/order/OrderManage/cusStock?token=${token}`,{},{});

                // console.log(addCustomer.data);
              }

              const updateStatusOrder = await  axios.post(process.env.API_URL+`/zort/order/OrderManage/updateStatusOrder?token=${token}`,{},{});
              res.json({log:'Add Complete'})
            }else{
              res.json({log:'no orderNew'})
            }


      } catch (error) {
        console.log(error)
        res.status(500).json(error) 
      } 

  });  

module.exports = addOrder;    