const express = require('express');
const addOrderErp = express.Router();
const { Op, sequelize } = require('sequelize');
const axios = require('axios')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Sequelize,DataTypes,QueryTypes } = require('sequelize');
const { log } = require('console');
require('dotenv').config();
require('moment/locale/th');
// const currentDate = moment().utcOffset(7).format('YYYY-MM-DDTHH:mm');
const currentDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');

addOrderErp.post('/addOrderErp', async (req, res) => {

    const sequelize = new Sequelize(process.env.databaseerp, process.env.user, process.env.password, {
        dialect: process.env.dialact,
        host: process.env.server, 
        });

        try {
          const token = jwt.sign(
            { username: 'systemm3' },
            process.env.TOKEN_KEY,
            { expiresIn: '2h' }) 

          const response = await axios.post(process.env.API_URL+'/zort/order/OrderManage/getOrder12TIntoM3',{ token:token },{});

          for(const order of response.data ){
            const list = order.item
            for(let i =0;i<list.length;i++){
                console.log(i);
                    const query = `
                    INSERT INTO [dbo].[data_order] (orderdate,senddate,orderno,customerordno, ordertype,warehouse,facility,staticid,ourref,yourref,customercode,addressno,itemno,itemcode,
                        unit,qty,price,discount,procode,salecode,responsible,channel,status,insert_at,update_at) 
                    VALUES (:value1,:value2,:value3,:value4,:value5,:value6,:value7,:value8,:value9,:value10,:value11,:value12,:value13,:value14,:value15,
                        :value16,:value17,:value18,:value19,:value20,:value21,:value22,:value23,:value24,:value25)
                    `;
                        var orderdatenum = parseInt(order.orderdateString.replace(/-/g, ''), 10)
                        if(!list[i].unit){
                            var unittext = 'PCS'
                        }else{
                            var unittext =list[i].unit
                        }
                        if(list[i].pricepernumber == null){
                            var pricenumber = 0
                        }else{
                            var pricenumber = list[i].pricepernumber
                        }
                        if(!list[i].procode){
                            if(list[i].procode == 'FV2F'){
                                var pcode = list[i].procode
                            }else{
                                var pcode = ''
                            }

                        }else{
                            if(list[i].procode == 'FV2F'){
                                var pcode = list[i].procode
                            }else{
                                var pcode = ''
                            }
                        }
                    const replacements = { 
                        value1:orderdatenum,  value11: order.customercode,    value21: 'SA02',        
                        value2:orderdatenum,  value12: '',                    value22: order.saleschannel,     
                        value3:order.cono,    value13: i+1,                   value23:0,     
                        value4: order.inv,    value14: list[i].sku,           value24: currentDate,     
                        value5:'071',         value15:unittext,               value25: currentDate,  
                        value6: '108',        value16:list[i].number,       
                        value7: 'F10',        value17:pricenumber, 
                        value8: 'YSEND',      value18:0,       
                        value9: order.number, value19:pcode,    
                        value10: '',           value20: '11002',     
                    }
                    const result = await sequelize.query(query, {
                        replacements,
                        type: sequelize.QueryTypes.INSERT
                    }); 
            }
          }
          res.json(response.data) 
        } catch (error) {
          console.log(error)
          res.json('Invalid data')
        }
   


}),

  module.exports = addOrderErp
