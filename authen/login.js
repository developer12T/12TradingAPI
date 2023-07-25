require('dotenv').config();

const express = require('express')
const { Sequelize } = require('sequelize');
const  jwt = require('jsonwebtoken')

const router = express.Router();
const { User } = require('./model/users')

router.post('/login', async (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  try {
    const dataUser = await User.findOne({
      where: {
        username: username,
        password: password,
      },
    });
     
    if (!dataUser) {
      res.json({ error: "Invalid username or password" });
    } else {

      var userName = dataUser.fullname

      const token = jwt.sign(
            { username: dataUser.username }, 
              process.env.TOKEN_KEY, 
            { expiresIn: '2h' });
            res.json({token,userName})

    }
  
  } catch (error) {
      console.log(error)
      res.json('Invalid req')
  }
})

router.post("/addUser", async (req,res) => {
  try {
    const addState = await User.create(req.body, {
      where: {
        id: {
          [Sequelize.Op.ne]: req.body.id 
        }
      }
    });

    res.json(addState)

  } catch (error) {
      console.log(error)
      res.json('Invalid req')
  }
})

module.exports = router