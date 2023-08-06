const express = require('express');
const updateStock12T = express.Router();
const { Op } = require('sequelize');
const { Product } = require('../model/Product') ;
const axios = require('axios'); 
const stock = require('../dataM3/getStock')

updateStock12T.put('/updateStock12T', async (req, res) => { 
    try {  
                const data = await stock() ;
                const itemcodeToAvailableBalanceSum = {};

            data.forEach(item => {
                const { itemcode, available, balance } = item;
                const trimmedItemcode = itemcode.trim(); 
                if (trimmedItemcode in itemcodeToAvailableBalanceSum) {
                  itemcodeToAvailableBalanceSum[trimmedItemcode].available += available;
                  itemcodeToAvailableBalanceSum[trimmedItemcode].balance += balance;
                } else {
                  itemcodeToAvailableBalanceSum[trimmedItemcode] = {
                    available,
                    balance
                  };
                }
              });
              
              // แปลงผลลัพธ์ให้เป็น array ตามที่ต้องการ
              const result = Object.keys(itemcodeToAvailableBalanceSum).map(itemcode => ({
                itemcode,
                sumavailable: itemcodeToAvailableBalanceSum[itemcode].available,
                sumbalance: itemcodeToAvailableBalanceSum[itemcode].balance
              }));

            //  console.log(result.length);
              for(let i=0;i<result.length;i++){

                //  console.log(result[i].itemcode)

                const stockzort = await Product.findAll({
                    attributes:['sku','stock'],
                    where:{
                        sku:{
                            [Op.like]: `%${result[i].itemcode}%`
                        }
                    }
                })
                    for(const skuZort of stockzort){

                        const itcode = skuZort.sku
                        var itcodeOnly = itcode.split('_')[0];
                        var unitOnly = itcode.split('_')[1];

                        try {
                            const response = await axios.post(process.env.API_URL+'/M3API/ItemManage/Item/getItemConvertItemcode',{ itcode:itcodeOnly }, {});

                            const restdata = response.data;
                                // console.log(restdata[0].type.factor);
                                const restIns = restdata[0].type
                                for(const restSku of restIns){
                                  
                                    if((unitOnly == 'PCS' )||(unitOnly == 'BOT') || (unitOnly == 'Free')  ){
                                        console.log('testttt'+itcodeOnly+'_'+unitOnly);
                                        var skufind = itcodeOnly+'_'+unitOnly
                                        await Product.update({stock:result[i].sumbalance,availablestock:result[i].sumavailable},{where:{sku:skufind}})
                                    }else if(unitOnly == restSku.unit){
                                        var skufind = itcodeOnly+'_'+unitOnly
                                        var stockCon = Math.floor(result[i].sumbalance / restSku.factor);
                                        var avistockCon = Math.floor(result[i].sumavailable / restSku.factor);
                                        await Product.update({stock:stockCon,availablestock:avistockCon},{where:{sku:skufind}})
                                    }else if(unitOnly == 'PCS4'){
                                        var skufind = itcodeOnly+'_'+unitOnly
                                        var stockCon = Math.floor(result[i].sumbalance / 4);
                                        var avistockCon = Math.floor(result[i].sumavailable / 4);
                                        await Product.update({stock:stockCon,availablestock:avistockCon},{where:{sku:skufind}})
                                    }
                                }
                            //  if (!response) {
                            //     return;
                            // } else {
                            //     const restdata = response.data;
                            //     // console.log(restdata[0].type.factor);
                            //     const restIns = restdata[0].type
                            //     for(const restSku of restIns){
                                  
                            //         if(unitOnly == 'PCS'){
                            //             console.log('testttt'+itcodeOnly+'_'+unitOnly);
                            //             var skufind = itcodeOnly+'_'+unitOnly
                            //             await Product.update({stock:result[i].sumbalance,availablestock:result[i].sumavailable},{where:{sku:skufind}})
                            //         }else if(unitOnly == restSku.unit){
                            //             var skufind = itcodeOnly+'_'+unitOnly
                            //             var stockCon = Math.floor(result[i].sumbalance / restSku.factor);
                            //             var avistockCon = Math.floor(result[i].sumavailable / restSku.factor);
                            //             await Product.update({stock:stockCon,availablestock:avistockCon},{where:{sku:skufind}})
                            //         }
                            //     }
                            // }
                        } catch (error) {
                            console.error('Error during Axios POST:', error.message);
                        }
                    }
              }
    
        res.json(result)
    } catch (error) {
        res.status(500).json('Invalid data')
    }
})

module.exports = updateStock12T;    