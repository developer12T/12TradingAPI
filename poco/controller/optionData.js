
const express = require('express');
const getOptionData = express.Router();
const { preItemMaster } = require('../model/Preitemmaster')
const { itemMaster } = require('../model/Itemmaster')

getOptionData.post('/getPreItemOption', async (req, res) => {
    try {
        
        const data = await preItemMaster.findAll({attributes:['group'],group: ['group']})
        res.json(data)
  
    } catch (error) {
      console.log(error);
      res.json('not found')
    }
})

getOptionData.post('/geItemOption', async (req, res) => {
    try {
        
        const data = await itemMaster.findAll({attributes:['group'],group: ['group']})
        res.json(data)
  
    } catch (error) {
      console.log(error);
      res.json('not found')
    }
})
  
  module.exports = getOptionData;  