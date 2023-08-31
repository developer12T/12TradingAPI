const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { UserAnt } = require('./model/userAnt');
// const os = require('os');
const router = express.Router();

router.post('/addAnt', async (req, res) => {
    try {
        const dataUser = await UserAnt.findAll({
          attributes: { exclude: ['id'] },
    });
      
        res.json(dataUser)
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Invalid req' });
      }
});

module.exports = router;
