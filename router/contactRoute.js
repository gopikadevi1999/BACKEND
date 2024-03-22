const express = require('express');
const EmailSender = require('./Email.js')

const router = express.Router();

router.post('/send', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        EmailSender({name,email,phone,message})
        res.status(200).send({status:true, message:"Email sent successfully"})

    } catch (error) {
        res.status(500).send({status:false, message:error.message})
    }
    
})
  
  module.exports = router;