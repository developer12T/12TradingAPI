const { sequelize,DataTypes } = require('../config/database');

const OrderCash = sequelize.define('data_cash_order', {
    orderdate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ordertime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderno: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    itemno: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    itemcode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    qtypcs: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    qtyctn: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    customercode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    team: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salecode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    channel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    period: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    update: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  },{freezeTableName:true,timestamps:false,createdAt:false,updatedAt:false,primaryKey:false});

const OrderCashCN = sequelize.define('data_cash_cn', {
    dcn_orderdate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dcn_orderno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dcn_itemcode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dcn_itemname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dcn_itemtype: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dcn_itemqty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dcn_itemunit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dcn_itemprice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    dcn_customer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dcn_zone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dcn_area: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dcn_update: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  },{freezeTableName:true,timestamps:false,createdAt:false,updatedAt:false,primaryKey:false});

  module.exports = {
    OrderCash,
    OrderCashCN,
};