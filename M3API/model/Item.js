const { sequelize,DataTypes } = require('../config/dbconnect');

const Item = sequelize.define('MITMAS', {
    MMCONO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MMSTAT: {
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
    },
    MMITTY: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MMCFI3: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },{freezeTableName:true,timestamps:false,createdAt:false,updatedAt:false,primaryKey:false});

  const ItemConvert = sequelize.define('MITAUN', {
    MUCONO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MUITNO: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MUALUN: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    MUCOFA: {
      type: DataTypes.INTEGER,
      allowNull: false,
  }
  },{freezeTableName:true,timestamps:false,createdAt:false,updatedAt:false,primaryKey:false});

module.exports = {
    Item,
    ItemConvert,
};