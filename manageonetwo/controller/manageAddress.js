const express = require('express');
const manageAddress = express.Router();
const fs = require('fs'); // เพิ่ม fs module
const path = require('path'); // เพิ่ม path module
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { User } = require('../model/user');
const { log } = require('console');


manageAddress.post('/addAddress', async(req,res)=>{

    const addressData = req.body;
    const jsonPath = path.join(__dirname, '..', 'jsonData', 'address.json');
    var existingData = [];
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, 'utf-8');
      existingData = JSON.parse(jsonData);
    } 
  
    existingData.push(addressData);

    fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2), 'utf-8');
  
    res.json('Address data saved successfully.');
})
 
manageAddress.get('/getAddress', (req, res) => {
    const jsonPath = path.join(__dirname, '..', 'jsonData', 'address.json');
    if (fs.existsSync(jsonPath)) { 
      const jsonData = fs.readFileSync(jsonPath, 'utf-8');
      const addressData = JSON.parse(jsonData);
      res.json(addressData);
    } else {
      res.json([]);
    }
  });

  manageAddress.put('/updateAddress/:id', (req, res) => {
    const addressId = req.params.id;
    const updatedData = req.body;
    const jsonPath = path.join(__dirname, '..', 'jsonData', 'address.json');
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, 'utf-8');
      let existingData = JSON.parse(jsonData);
      const index = existingData.findIndex((data) => data.idApp === addressId);
      if (index !== -1) {
        existingData[index] = { ...existingData[index], ...updatedData };
        fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2), 'utf-8');
        res.json('Address data updated successfully.');
      } else {
        res.status(404).json('Address not found.');
      }
    } else {
      res.status(500).json('Internal server error.');
    }
  });

  manageAddress.delete('/deleteAddress/:id', (req, res) => {
    const addressId = req.params.id;
    const jsonPath = path.join(__dirname, '..', 'jsonData', 'address.json');
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, 'utf-8');
      let existingData = JSON.parse(jsonData);
      const index = existingData.findIndex((data) => data.idApp === addressId);
      if (index !== -1) {
        existingData.splice(index, 1);
        fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2), 'utf-8');
        res.json('Address data deleted successfully.');
      } else {
        res.status(404).json('Address not found.');
      }
    } else {
      res.status(500).json('Internal server error.');
    }
  });


module.exports = manageAddress;    