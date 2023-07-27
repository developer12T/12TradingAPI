const express = require("express");
const getStock = express.Router();
const { Stock } = require("../model/stock");
const { sequelize } = require("../config/dbconnect");
const { Op } = require("sequelize");

getStock.post("/getStock", async (req, res) => {
  try {

  
    const data = await Stock.findAll({
      attributes: { exclude: ["id"] },
    });

    for (const gdata of data) {
      var sumCol = gdata.balance + gdata.allocated;
      gdata.sumCol = sumCol;
    }

    res.json(datgdataa);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
}),
  (module.exports = getStock);
