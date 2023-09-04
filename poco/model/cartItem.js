const { sequelize,DataTypes } = require('../config/database') ;

const cartItem = sequelize.define('CartItem', {
    id:{ type: DataTypes.INTEGER,allowNull: false,primaryKey: true,autoIncrement: true},
    idUser: { type: DataTypes.STRING,allowNull: true},
    idProduct: { type: DataTypes.STRING,allowNull: true},
    qty:{type:DataTypes.INTEGER,allowNull:false},
    createdAt:{type: DataTypes.STRING,collate: 'Thai_CI_AS',allowNull: true,},
    updatedAt:{type: DataTypes.STRING,collate: 'Thai_CI_AS',allowNull: true,},
   
},{freezeTableName:true,timestamps:false,createdAt:false,updatedAt:false})

// sequelize.sync({force:false,alter:false})  
 
module.exports = { cartItem };
 