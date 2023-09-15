const express = require('express');
const addCart = express.Router();
const moment = require('moment');
const { cartItem } = require('../model/cartItem')
const { itemMaster } = require('../model/Itemmaster')
const { Op } = require('sequelize')
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH-mm-ss');

addCart.post('/addCart', async (req, res) => {
  try {
    const { usercode,procode,qty } = req.body 
    await cartItem.create({idUser:usercode,idProduct:procode,qty:qty,createdAt:currentDate,updatedAt:currentDate})
    res.json('complete')
  } catch (error) {
    console.log(error);
    res.json('not found')
  }

})

addCart.post('/deleteCart', async (req, res) => {
  try {
    const { usercode, procode } = req.body;
      await cartItem.destroy({ where:{idUser: usercode, idProduct: procode }});
    res.json('complete');
  } catch (error) {
    console.log(error);
    res.json('not found')
  }

})

addCart.post('/getCart', async (req, res) => {
  try { 
    const usercode  = req.body.usercode
    const cartData = []
    const data =  await cartItem.findAll({where:{
      idUser:usercode
    }})
    for(const list of data){

      const itemDetail = await itemMaster.findAll({where:{productId:list.idProduct}})
      const cartItem = {
        ...itemDetail[0].toJSON(), // เพิ่มรายละเอียดของ itemDetail ลงใน cartItem
        qty: list.qty // เพิ่ม list.qty เข้าไปใน cartItem
      };
      cartData.push(cartItem);

    }
    res.json(cartData)
  } catch (error) {
    console.log(error);
    res.json('not found')
  }

})

addCart.post('/getSelectCart', async (req, res) => {
  try {
    const usercode  = req.body.usercode
    const cartData = []

    const data =  await cartItem.findAll({where:{
      idUser:usercode
    }})

      const itemDetail = await itemMaster.findAll({where:{status:'1'}})

      for (const listItem of itemDetail) {
  
        const itemNotInCart = !data.some((cartItem) => cartItem.idProduct === listItem.productId);
      
        if (itemNotInCart) {
          cartData.push(listItem);
        }
      }
      
    res.json(cartData)
  } catch (error) {
    console.log(error);
    res.json('not found')
  }

})

module.exports = addCart;  