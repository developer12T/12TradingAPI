const express = require("express");
const getOrder = express.Router();
const { NumberSeries } = require("../model/order");

getOrder.post("/getNumberSeries", async (req, res) => {
  try {

    const data = await NumberSeries.findAll({
      attributes: { 
        exclude: ["id"]
      }
    });
    res.json(data);

  } catch (error) {
    console.error(error);
    res.json(error);
  }
}),

module.exports = getOrder;