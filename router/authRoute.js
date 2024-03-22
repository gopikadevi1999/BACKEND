const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Auth = require('../model/authModel')
const nodemailer = require('nodemailer');
const dotenv = require('dotenv')

dotenv.config()

const router = express.Router()

//signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await Auth.findOne({ email });
    if (user) {
        return res.status(400).send("User already exists")
    }

    let cart = {};
    for (let i = 0; i <= 300; i++) {
        cart[i] = 0;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Auth({
        name,
        email,
        password: hashedPassword,
        cartData: cart
    })
    await newUser.save();

    res.status(201).send({
        status: true,
        message: "User created successfully",
    })
})

//login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Auth.findOne({ email });
    if (!user) {
        return res.json({ status: false, message: "Invalid credentials" })
       
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({ status: false, message: "Invalid credentials" })
     
    }

    //create token
    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' })
    // res.("token", token, { httpOnly: true, maxAge: 360000 })
    return res.json({ status: true, message: "Login successful", data: token })
})

//forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.json({ status: false, message: "User not found" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' })

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {rejectUnauthorized: false}
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5174/resetpassword/${token}`,
            
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.json({ status: false, message: "Email not sent", error: error })
            } else {
                return res.json({ status: true, message: "Email sent" })
            }
        });

    } catch (error) {
       console.log(error)
    }
})

//reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const {token} = req.params;
        const { password } = req.body;
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;
        const hashedPassword = await bcrypt.hash(password, 10);
        await Auth.findByIdAndUpdate({ _id: id}, { password: hashedPassword });
        return res.json({ status: true, message: "Password reset successful" })
    } catch (error) {
        return res.json({ status: false, message: "Invalid token" })
    }
})

//logout
router.get('/logout', (req, res) => {
    //res.clearCookie("token")

    return res.json({ status: true, message: "Logout successful" })  
})

//login verification
router.post('/verify', async (req, res) => {
    const token = req.body.token
    console.log(token)
        if (!token) {
        return res.json({ status: false, message: "Unauthorized" })
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ status: true, message: "Authorized", data: decoded })
    } catch (error) {
        return res.json({ status: false, message: "Unauthorized" })
    }
    
})




module.exports = router