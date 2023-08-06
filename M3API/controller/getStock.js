const express = require('express');
const getStock = express.Router();
const { Stock } = require('../model/stock');
const { Item } = require('../model/Item');
const {Sequelize, AsyncQueueError} = require('sequelize');
const { log } = require('console');

getStock.post('/getStock', async (req, res) => {
  try {
    const stocks = []
    const data = await Stock.findAll({
      attributes: { 
        exclude: ['id'],
        // include: [ 
        //   [Sequelize.literal('MLSTQT - MLALQT'), 'available'],
        // ],
      },
      where:{companycode:410,warehouse:"108"}
    });
    for(let i =0 ;i <data.length;i++){

      const itemsName = await Item.findAll({
        attributes:['itemname'],
        where:{itemcode:data[i].itemcode},
        group: ['MMFUDS']
      })

      itemsName.forEach((item) => {
        console.log(item.itemname);
         iname = item.itemname;
      });
   

      const stock = {
        companycode:data[i].companycode,
        warehouse:data[i].warehouse,
        itemcode:data[i].itemcode,
        itemsname:iname,
        location:data[i].location,
        lot:data[i].lot,
        balance:data[i].balance,
        allocated:data[i].allocated,
        available:data[i].balance-data[i].allocated
      }
     stocks.push(stock);

    }
    res.json(stocks);

  } catch (error) {
    console.error(error);
    res.json(error);
  }
}),

getStock.post('/getStockDetail', async (req, res) => {
  const warehouse = req.body.warehouse
  const itemcode = req.body.itcode
  try {
    const stocks = []

    if(itemcode == ''){
      var data = await Stock.findAll({
        attributes: { 
          exclude: ['id'],
          // include: [ 
          //   [Sequelize.literal('MLSTQT - MLALQT'), 'available'],
          // ],
         
        },
        where:{warehouse:warehouse}
      });
    }else{
      var data = await Stock.findAll({
        attributes: { 
          exclude: ['id'],
          // include: [ 
          //   [Sequelize.literal('MLSTQT - MLALQT'), 'available'],
          // ],
         
        },
        where:{itemcode:itemcode,warehouse:warehouse},
        group: ['MMFUDS']
      });
    }

   
    for(let i =0 ;i <data.length;i++){

      const itemsName = await Item.findAll({
        attributes:['itemname'],
        where:{itemcode:data[i].itemcode}
      })

      itemsName.forEach((item) => {
        console.log(item.itemname);
         iname = item.itemname;
      });
   

      // const iname = itemsName.itemname;
      // const iname = itemsName[0].itemname;

      const stock = {
        companycode:data[i].companycode,
        warehouse:data[i].warehouse,
        itemcode:data[i].itemcode,
        itemsname:iname,
        location:data[i].location,
        lot:data[i].lot,
        balance:data[i].balance,
        allocated:data[i].allocated,
        available:data[i].balance-data[i].allocated
      }
     stocks.push(stock);

    }
    res.json(stocks); 

  } catch (error) {
    console.error(error);
    res.json(error);
  }
}),

getStock.post('/getStockCount', async (req, res) => {
  try {
    const data = await Stock.count()
    res.json([{"stockerp":data}]);

  } catch (error) {
    console.error(error);
    res.json(error);
  }
}),
  (module.exports = getStock);
