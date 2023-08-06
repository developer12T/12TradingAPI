const express = require('express');
const app = express();
const cron = require('node-cron');

const zortCronFunc = require('./zortCorn');


cron.schedule('*/5 * * * * *', () => {
    zortCronFunc();
});


