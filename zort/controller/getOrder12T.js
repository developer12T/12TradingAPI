const express = require('express');
const getOrder = express.Router();
const { Op } = require('sequelize');
const { Order,OrderDetail } = require('../model/Order') ;
const { Customer } = require('../model/Customer') ;

getOrder.post('/getOrder', async (req, res) => { 
    var page = req.body.page;
    var tab = req.body.tab ;
    try {

        if(page == 'recipt'){
            if(tab == 'wait-tab'){
                const data = await Order.findAll({where:{statusprint:'000'}}) ;
                res.json(data) 
            }else if(tab == 'success-tab'){
                const data = await Order.findAll({where:{statusprint:'002'}}) ;
                res.json(data) 
            }
        }else if(page == 'all'){
            const orders = [] ;
            const data = await Order.findAll() ;
            // const data2 = await Customer.findAll({attributes:['customername']},{where:{customerid:data.customerid}}) ;
            // for(const cus of data){
            //     const orders = await Customer.findAll({attributes:['customername']},{where:{customerid:cus.customerid}}) ;
            //     console.log(orders)
            // }
        
    
            res.json(data) 
        }else if(page == 'inv'){
            const data = await Order.findAll({where:{statusprintINV:'TaxInvoice'}}) ;
            res.json(data) 
        }
   
    } catch (error) {
        res.status(500).json('invalid data')
        console.log(error)
    }

}) ;


module.exports = getOrder;    