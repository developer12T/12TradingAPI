const { connectM3,mssql,sequelize,DataTypes } = require('../config/dbconnect');

const Item = sequelize.define('MITMAS', {
    MMCONO: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MMITNO: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MMFUDS: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  },{freezeTableName:true,timestamps:false,createdAt:false,updatedAt:false,primaryKey:false});

module.exports = {
    Item,
};