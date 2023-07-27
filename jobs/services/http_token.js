
const jwt = require('jsonwebtoken');

const token_jobs = () => {
    const token = jwt.sign(
        { key: 'jobsActive' },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      );

      return token;
};
 
module.exports = token_jobs;