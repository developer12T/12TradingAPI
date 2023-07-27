const express = require('express');
const getItem = express.Router();
const { Item,ItemConvert } = require('../model/Item')
const { Op } = require('sequelize');

getItem.post('/getItem', async(req,res)=>{
    try {
    const data = await Item.findAll({ 
        attributes: { exclude: ['id'] }
    });
    res.json(data);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
}),

getItem.post('/getItemConvert', async(req,res)=>{
    try {
    const data = await ItemConvert.findAll({ 
        attributes: { exclude: ['id'] }
    });
    res.json(data);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
})


module.exports = getItem;  