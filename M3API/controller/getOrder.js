const express = require("express");
const getOrder = express.Router();
const { NumberSeries } = require("../model/order");
const { Op } = require('sequelize');

getOrder.post("/getNumberSeries", async (req, res) => {
  const series = req.body.series
  const seriesname = req.body.seriesname
  const seriestype = req.body.seriestype
  const companycode = req.body.companycode
  try {
    if(!series || !seriesname || !seriestype || !companycode){
      const data = await NumberSeries.findAll({
        attributes: { 
          exclude: ["id"]
        }
      });
      res.json(data);
    }else{

      const data = await NumberSeries.findAll({
        attributes: { 
          exclude: ["id"]
        },
        where: {
          [Op.or]: [
            {
              companycode: companycode,
              series: series,
              seriestype: seriestype,
            },
            {
              seriesname: {
                [Op.like]: '%${seriesname}%',
              }
            }
      
          ]
        }
      });

      res.json(data);
    }
    

  

  } catch (error) {
    console.error(error);
    res.json(error);
  }
}),

module.exports = getOrder;