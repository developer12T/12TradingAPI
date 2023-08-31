const express = require('express');
const getDateLast = express.Router();
const multer = require('multer');
const moment = require('moment');
const { itemMaster } = require('../model/Itemmaster')
const { preItemMaster } = require('../model/Preitemmaster')
const { Op } = require('sequelize')
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH-mm-ss');
getDateLast.post('/getDateLast', async (req, res) => {
    try {
        
    
        const date = await itemMaster.findOne({
            attributes:['createdAt'],
            order: [['createdAt', 'DESC']]
        })
        // console.log(date);
        if(date !== null){
            res.status(200).json(date.createdAt.split("T")[0]);
        }else{
            res.status(200).json('----/--/--');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
})

getDateLast.put('/upDateLast', async (req, res) => {
    try {
       const item = await itemMaster.findAll() ;
       for(const list of item){
        await itemMaster.update({createdAt:currentDate},{where:{id:list.id}})
       }
        
        res.json('200')
       
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
})

module.exports = getDateLast;  