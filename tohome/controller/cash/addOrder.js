const express = require('express');
const moment = require('moment');
const addOrderCash = express.Router();
const { OrderCash, OrderCashCN } = require('../../model/Order');
const dataOrderCN = require('../service/getOrderCN');
const dataOrder = require('../service/getOrder');

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
};

require('moment/locale/th');
const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH:mm');

addOrderCash.put('/addOrderCN', async (req, res) => {
  try {
    createddate = currentDate;
    const data = await dataOrderCN();
    for (const item of data) {
      await OrderCashCN.findOrCreate({
        where:{
          dcn_orderno:item.CN_NO,
          dcn_itemcode: item.ItemNO,
          dcn_itemtype: item.ProductStatus,
          dcn_itemqty: item.QTY,
        },
        defaults:{
        dcn_orderdate: item.ExDate,
        dcn_orderno: item.CN_NO,
        dcn_itemcode: item.ItemNO,
        dcn_itemname: item.ItemName,
        dcn_itemtype: item.ProductStatus,
        dcn_itemqty: item.QTY,
        dcn_itemunit: item.Unit,
        dcn_itemprice: parseFloat(item.Price),
        dcn_customer: item.StoreName,
        dcn_zone: item.ZONE,
        dcn_area: item.AREA,
        dcn_update: createddate,
        }
      });
    }
    res.status(200).json('success');
    // res.json(data)

    // const data = await dataOrderCN();
    // const promises = data.map(async (item) => {
    //   const [order, created] = await OrderCN.findOrCreate({
    //     where: {
    //       dcn_orderno: item.CN_NO,
    //       dcn_itemcode: item.ItemNO,
    //       dcn_itemtype: item.ProductStatus,
    //     },
    //     defaults: {
    //       dcn_orderdate: item.ExDate,
    //       dcn_itemcode: item.ItemNO,
    //       dcn_itemname: item.ItemName,
    //       dcn_itemtype: item.ProductStatus,
    //       dcn_itemqty: item.QTY,
    //       dcn_itemunit: item.Unit,
    //       dcn_itemprice: parseFloat(item.Price),
    //       dcn_customer: item.StoreName,
    //       dcn_zone: item.ZONE,
    //       dcn_area: item.AREA,
    //       dcn_update: currentDate,
    //     },
    //   });
    //   return { order, created };
    // });

    // const results = await Promise.all(promises);
    // const createdCount = results.filter((result) => result.created).length;

    // res.status(200).json({ message: 'success', createdCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error', error: error.message });
  }
}),

addOrderCash.put('/addOrder', async (req, res) => {
  try {
    createddate = currentDate;
    const period = formatDate(new Date());

    const data = await dataOrder();
    const order = await data.map(async (item) => {
      await OrderCash.findOrCreate({
        where: {
          customercode: item.custno,
          orderno: item.orderno,
          itemcode: item.itemno,
        },
        defaults: {
          orderdate: item.orderdate,
          ordertime: item.ordertime,
          orderno: item.orderno,
          itemcode: item.itemno,
          qtypcs: parseFloat(item.qty_ctn),
          qtyctn: parseFloat(item.qty_pcs),
          amount: parseFloat(item.amount),
          customercode: item.custno,
          zone: item.zone,
          area: item.area,
          salecode: item.salecode,
          channel: item.channel,
          period: period,
          update: currentDate,
        },
      });
      return order ;
    });

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error', error: error.message });
  }
}),

module.exports = addOrderCash;