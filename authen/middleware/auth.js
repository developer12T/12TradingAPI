const jwt = require('jsonwebtoken')

const config = process.env
const verifyToken = (req,res,next) =>{
    const token = req.body.token || req.query.token || req.headers['x-access-token']
    if (!token) {
        return res.json('require token a')
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY)
        req.user = decoded
        next();
        // console.log(decoded)
    } catch (error) {
        return res.json('Invalid token')
    }
}

module.exports = verifyToken