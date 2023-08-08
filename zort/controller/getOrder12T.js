const express = require('express');
const getOrder = express.Router();

const receiptWaitTab = require('../subController/ReceiptWaitTab'); 
const receiptSuccessTab = require('../subController/ReceiptSuccessTab'); 
const AllOrderTab = require('../subController/AllOrderTab'); 
const invtWaitTab = require('../subController/InvWaitTab'); 
const invSuccessTab = require('../subController/InvSuccessTab'); 
const M3WaitTab = require('../subController/M3WaitTab'); 
const M3SuccessTab = require('../subController/M3SuccessTab'); 

getOrder.post('/getOrder', async (req, res) => {
    var page = req.body.page;
    var tab = req.body.tab;
    try {
        if (page == 'receipt') {
            if (tab == 'wait-tab') {
                receiptWaitTab(res).then(orders => {res.json(orders); })
            } else if (tab == 'success-tab') {
                receiptSuccessTab(res).then(orders => {res.json(orders); })
            }
        } else if (page == 'all') {
                AllOrderTab(res).then(orders => {res.json(orders); })
        } else if (page == 'inv') {
            if (tab == 'wait-tab') {
                invtWaitTab(res).then(orders => {res.json(orders); })
            } else if (tab == 'success-tab') {
                invSuccessTab(res).then(orders => {res.json(orders); })
            }
        }else if(page == 'preparem3'){
            if (tab == 'wait-tab') {
                M3WaitTab(res).then(orders => {res.json(orders); })
            } else if (tab == 'success-tab') {
                M3SuccessTab(res).then(orders => {res.json(orders); })
            }
        }
    } catch (error) {
        res.status(500).json('invalid data')
        console.log(error);
    }

});


module.exports = getOrder;