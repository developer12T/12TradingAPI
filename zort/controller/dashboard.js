const express = require('express');
const DasboardView = express.Router();
const { sequelize } = require('../config/database')
const { Order } = require('../model/Order')
const { Op } = require('sequelize');
const axios = require('axios')
const { Product } = require('../model/Product')
DasboardView.post('/getData', async (req, res) => {

    try {
        
        const countOrderAll = await Order.count() ;
     
        const countOrderShopee = await Order.count({where:{saleschannel:'Shopee'}}) ;
        const countOrderLazada = await Order.count({where:{saleschannel:'Lazada'}}) ;
   
        const countOrderWaitPrint = await Order.count({where:{
            statusprint:'000',
            statusPrininvSuccess:'000'
    }}) ;

        const StockZort = await Product.count() ;

        const StockZortout = await Product.count({where:{stock:0}}) ;

        var StockM3 = await axios.post('http://192.168.2.97:8383/M3API/StockManage/Stock/getStockCount');
        var countStockM3 = (StockM3.data[0].stockerp);  
        
        res.json([{
            'CountOrderAll':countOrderAll,
            'OrderCountShopee':countOrderShopee,
            'OrderCountLazada':countOrderLazada,
            'CountOrderWaitPrint':countOrderWaitPrint,
            'CountOrderSuccessPrint':countOrderAll-countOrderWaitPrint,
            'StockZort':StockZort,    
            'WarStock':StockZortout,    
            'StockM3':countStockM3,    

        }])
    } catch (error) {
        console.log(error);
        res.json("invalid req")
    }
})

module.exports = DasboardView;  