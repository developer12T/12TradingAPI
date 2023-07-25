const express = require('express');
const getStock = express.Router();
// const { Stock,stockERP,getStockM3 } = require('../M3API/model/stock')
// const { StockTest } = require('../M3API/model/test')
const { Item } = require('../model/Item')
const { sequelize } = require('../config/dbconnect')
const { Op } = require('sequelize');

getStock.post('/getStock', async(req,res)=>{
    // try {
    //     const pool = await mssql.connect(connectM3);
    //     const request = pool.request();
    //     const results = await request.query(`SELECT MLITNO FROM [MVXJDTA].[MITLOC] WHERE MLWHLO = '108' `);
    //     const users = await stockERP();
    //     const user = users.recordset;
    //     console.log(user);
    //         for (const data of user) {
    //             // const stock = {
    //             //     itemcode: data.recordsets[i].MLITNO,
    //             //     warehouse: data.recordsets[i].MLWHLO,
    //             // };
    //             console.log(data);
    //         }
    //     res.status(200).json(user);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'An error occurred while fetching the data.' });
    //   }
    // stockERP()
    // .then((stock) => {
    //     console.log(stock); 
    //     res.status(200).json(stock);
    // })
    // .catch((error) => {
    //     console.error(error);
    // });
    
    // const data = await stockERP();
    // const stocks = [];
    // for (let i = 0; i < data.length; i++) {
    //     for (let n = 0; n < data.recordsets.length; n++) {
    //         const stock = {
    //             itemcode: data.recordsets[n].MLITNO,
    //             warehouse: data.recordsets[n].MLWHLO,
    //         };
    //         stocks.push(stock);
    //     }
    // }
    // const stock = {
    //     itemcode: data.MLITNO,
    //     warehouse: data.MLWHLO,
    // };
    // stocks.push(stock);

    // console.log(stocks);
    // const data = await Stock.findAll({
    //     attributes: ['MLITNO']
    // });
    // res.json(data);
    try {
    //     sequelize
    // .authenticate()
    // .then(() => {
    //     console.log('Connection has been established successfully.');
    // })
    // .catch(err => {
    //     console.error('Unable to connect to the database:', err);
    // });
       // console.log(stocks);
    const data = await Item.findAll({ 
        attributes: ['MMITNO','MMFUDS']
    });
    res.json(data);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
    // console.log(sequelize);
})


module.exports = getStock;  