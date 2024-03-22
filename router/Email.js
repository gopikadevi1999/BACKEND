const nodemailer = require('nodemailer');
const dotenv = require('dotenv')

dotenv.config();

//create nodemailer
const Email = (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: {rejectUnauthorized: false}
    })
    transporter.sendMail(options,(error, info) => {
        if (error) {
            console.log(error);
            return;
        } 
    });
}
//send mail

const EmailSender = ({name,email,phone,message}) =>{
    const options = {
        from: process.env.EMAIL,
        to: process.env.SEND_TO,
        subject: 'Message from RSR Crackers',
        html:`
        <h3>Contact Details</h3>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone}</li>
          <li>Message: ${message}</li>
        </ul>
        `
    }
    Email(options)
}

module.exports = EmailSender