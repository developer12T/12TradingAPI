const express = require('express');
const router = express.Router();

router.post('/getAddress', async (req, res) => {
    try {
        res.json('success')
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Invalid req' });
      }
});

module.exports = router;
