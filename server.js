const app = require('./app.js');
const connectDatabase = require('./db/Database.js')

//Handling uncaught exception
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.message}`)
    console.log('Shutting down due to uncaught exception')
    process.exit(1)
})

//config 
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({
        path: './config/.env'
    })
}

// connect db
connectDatabase();

//create server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} `)
})

//Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err.message}`)
    console.log('Shutting down due to unhandled promise rejection')
    server.close(() => {
        process.exit(1)
    })
})

