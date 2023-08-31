const express = require('express');
const updateStatus = express.Router();
const multer = require('multer');
const moment = require('moment');
const { itemMaster } = require('../model/Itemmaster')
const { Op } = require('sequelize')
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH-mm-ss');
updateStatus.put('/updateStatus', async (req, res) => {
    try {

        await itemMaster.update({status:'1'},{where:{
            [Op.not]:{
                pricePerCTN:null,
                statusActive12T:'close',
                statusActiveFplus:'close'
            }
          
        }})
        await itemMaster.update({status:'0'},{where:{pricePerCTN:null}})
        await itemMaster.update({status:'0'},{where:{statusActive12T:'close'}})
        await itemMaster.update({status:'0'},{where:{statusActiveFplus:'close'}})
        res.status(200).json('update');
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    } 
})

updateStatus.put('/updateStatusByItem', async (req, res) => {
    try {
        const productid = req.body.productid ;
        const status = req.body.status ;
        if(status === '0'){
            var statusRevers = '1'
        }else{
            var statusRevers = '0'
        }
       await itemMaster.update({status:statusRevers},{where:{productId:productid}})
        // await itemMaster.update({status:'1'},{where:{
        //     [Op.not]:{
        //         pricePerCTN:null,
        //         statusActive12T:'close',
        //         statusActiveFplus:'close'
        //     }
          
        // }})
        // await itemMaster.update({status:'0'},{where:{pricePerCTN:null}})
        // await itemMaster.update({status:'0'},{where:{statusActive12T:'close'}})
        // await itemMaster.update({status:'0'},{where:{statusActiveFplus:'close'}})
        res.status(200).json('update');
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    } 
})

module.exports = updateStatus;  