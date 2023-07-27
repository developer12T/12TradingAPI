const express = require("express");
const getStock = express.Router();
const { Stock } = require("../model/stock");
const { sequelize } = require("../config/dbconnect");
const {Sequelize} = require('sequelize')
const { Op } = require("sequelize");

getStock.post("/getStock", async (req, res) => {
  try {

    const data = await Stock.findAll({
      attributes: { 
        exclude: ["id"],
        include: [ 
          [Sequelize.literal('MLSTQT - MLALQT'), 'available']
        ]
      }
    });

    res.json(data);

  } catch (error) {
    console.error(error);
    res.json(error);
  }
}),
  (module.exports = getStock);
