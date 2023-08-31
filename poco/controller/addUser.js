const express = require('express');
const addUser = express.Router();
const { userPoco } = require('../model/user')
const moment = require('moment');
const { Op } = require('sequelize')
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH-mm-ss');
addUser.post('/addUser', async (req, res) => {
    try {
        const { userId,wareHouse,role,status,userErp  } = req.body
        await userPoco.create({
                userId:userId,
                warehouse:wareHouse,
                role:role,
                status:status,
                userErp:userErp
        })

        res.status(200).json({userId,wareHouse,role,status,userErp});
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
})

addUser.post('/getUser', async (req, res) => {
    try {
      const data =  await userPoco.findAll() ;

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
})

addUser.post('/updateUser', async (req, res) => {
    try {
        const nowStatus = req.body.status
        const userId = req.body.userId
        if(nowStatus === '1'){
            var lstStatus = '0'
        }else{
            var lstStatus = '1'
        }

        await userPoco.update({status:lstStatus},{where:{userId:userId}})
        res.status(200).json('success');
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
})

module.exports = addUser;  