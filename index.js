const http = require('http')
const app = require('./app')

const server = http.createServer(app)

const { API_PORT } = process.env
const port = process.env.port || API_PORT

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, application/json');
//     next();
//   });
 

server.listen(port,()=>{
    console.log('server is running')
})