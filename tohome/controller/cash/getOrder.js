const express = require("express");
const getOrderCash = express.Router();
const { OrderCashCN } = require("../../model/Order");

getOrderCash.post("/getOrderCN", async (req, res) => {
  const orderdate = req.body.orderdate;
  const zone = req.body.zone;

  if (!orderdate && !zone) {
    return res.json({ message: "Require Orderdate or Zone" });
  }

  try {
    const orders = [];

    if (orderdate) {
      var data = await OrderCashCN.findAll({
        attributes: {
          exclude: ["id"],
        },
        where: { dcn_orderdate: orderdate },
      });
    } else {
      var data = await OrderCashCN.findAll({
        attributes: {
          exclude: ["id"],
        },
        where: { dcn_orderdate: orderdate, dcn_zone: zone },
      });
    }

    for (let i = 0; i < data.length; i++) {
      const order = {
        orderdate: data[i].dcn_orderdate,
        orderno: data[i].dcn_orderno,
        itemcode: data[i].dcn_itemcode,
        itemname: data[i].dcn_itemname,
        itemtype: data[i].dcn_itemtype,
        itemqty: data[i].dcn_itemqty,
        itemunit: data[i].dcn_itemunit,
        itemprice: data[i].dcn_itemprice,
        customer: data[i].dcn_customer,
        zone: data[i].dcn_zone,
        area: data[i].dcn_area,
      };
      orders.push(order);
    }

    if (data.length > 0) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error", error: error.message });
  }
}),

getOrderCash.post("/getOrder", async (req, res) => {
  const orderdate = req.body.orderdate;
  const zone = req.body.zone;

  if (!orderdate && !zone) {
    return res.json({ message: "Require Orderdate or Zone" });
  }

  try {
    const orders = [];

    if (orderdate) {
      var data = await OrderCashCN.findAll({
        attributes: {
          exclude: ["id"],
        },
        where: { dcn_orderdate: orderdate },
      });
    } else {
      var data = await OrderCashCN.findAll({
        attributes: {
          exclude: ["id"],
        },
        where: { dcn_orderdate: orderdate, dcn_zone: zone },
      });
    }

    for (let i = 0; i < data.length; i++) {
      const order = {
        orderdate: data[i].dcn_orderdate,
        orderno: data[i].dcn_orderno,
        itemcode: data[i].dcn_itemcode,
        itemname: data[i].dcn_itemname,
        itemtype: data[i].dcn_itemtype,
        itemqty: data[i].dcn_itemqty,
        itemunit: data[i].dcn_itemunit,
        itemprice: data[i].dcn_itemprice,
        customer: data[i].dcn_customer,
        zone: data[i].dcn_zone,
        area: data[i].dcn_area,
      };
      orders.push(order);
    }

    if (data.length > 0) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error", error: error.message });
  }
}),

module.exports = getOrderCash;
