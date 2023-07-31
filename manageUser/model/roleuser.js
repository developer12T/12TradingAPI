const { sequelize,DataTypes,QueryTypes } = require('../config/database');

const RoleUserZort = sequelize.define('data_role_zort', {
    id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roleDescription: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: true,
  }

},{freezeTableName:true,timestamps:true,createdAt:true,updatedAt:true})

// sequelize.sync({force:false,alter:false}) 

module.exports = { RoleUserZort };   