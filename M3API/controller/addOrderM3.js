const express = require('express');
const addOrderM3 = express.Router();

const moment = require('moment');
const { Sequelize,DataTypes,QueryTypes } = require('sequelize');

require('dotenv').config();

const { sequelize }  = require('../config/dbconnect')
addOrderM3.post('/addOrderM3', async (req, res) => {

    // const sequelize = new Sequelize(process.env.databaseerp, process.env.user, process.env.password, {
    //     dialect: process.env.dialact,
    //     host: process.env.server, 
    //     });

        try {
                    const query = ``;
                    const replacements = {}
                    const result = await sequelize.query(query, {
                        replacements,
                        type: sequelize.QueryTypes.INSERT
                    }); 
          res.json(result) 
        } catch (error) {
          console.log(error)
          res.json('Invalid data')
        }
}),

  module.exports = addOrderM3
