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
        const countOrderWaitPrintReceipt = await Order.count({where:{statusprint:'000',statusprintinv: {
            [Op.not]: 'TaxInvoice'
        }}}) ;
        const countOrderSuccessPrintReceipt = await Order.count({where:{statusprint:'001'}}) ;
        const countOrderSuccessPrintInv = await Order.count({where:{statusPrininvSuccess:'001'}}) ;
        const countOrderRePrintInv = await Order.count({where:{statusPrininvSuccess:'002'}}) ;
        const countOrderRePrintReceipt = await Order.count({where:{statusprint:'002'}}) ;

        const StockZort = await Product.count() ;

        var StockM3 = await axios.post('http://192.168.2.97:8383/M3API/StockManage/Stock/getStockCount');
        var countStockM3 = (StockM3.data[0].stockerp);  
        
        res.json([{
            'countOrderAll':countOrderAll,
            'OrderCountShopee':countOrderShopee,
            'OrderCountLazada':countOrderLazada,
            'OrderCountWaitPrintReceipt':countOrderWaitPrintReceipt,
            'OrderCountSuccessPrintReceipt':countOrderSuccessPrintReceipt,
            'OrderCountRePrintReceipt':countOrderRePrintReceipt,
            'OrderCountOrderSuccessPrint':countOrderSuccessPrintInv+countOrderSuccessPrintReceipt+countOrderRePrintInv+countOrderRePrintReceipt,
            'OrderCountOrderCountSuccessPrint':countOrderRePrintInv,
            'StockZort':StockZort,    
            'StockM3':countStockM3,    
        }])
    } catch (error) {
        console.log(error);
        res.json("invalid req")
    }
})

module.exports = DasboardView;  