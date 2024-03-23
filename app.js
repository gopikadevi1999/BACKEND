const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer')
const path = require('path')
const AuthRoutes = require('./router/authRoute.js');
const ContactRoutes = require('./router/contactRoute.js');
const ProductRoutes = require('./router/productRoute.js');
const PaymentRoutes = require('./router/payment.js')

const app = express();

app.use(cors({
    origin:['https://rsr-kappa.vercel.app', 'https://admin-24qe.vercel.app'],
    credentials: true
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use('/images', express.static('upload/images'));

//routes
app.use('/auth', AuthRoutes);
app.use('/contact', ContactRoutes);
app.use(ProductRoutes);
app.use(PaymentRoutes);


//create multer storage

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

app.use('/images', express.static('upload/images'));
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success:1,
        image_url : `https://rsr-backend.onrender.com/images/${req.file.filename}`
    })
})

app.get('/', (req, res) => {
    res.send('hello world')
})

//config 
if(process.env.NODE_ENV !== 'PRODUCTION'){
    require('dotenv').config({
        path: './config/.env'
    })
}



module.exports = app;