const mongoose = require('mongoose');

//create schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        validate:{
            validator:validateEmail,
            message: props => `${props.value} is not a valid email!`
        }
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        unique: true
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        unique: true
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

const Contact = mongoose.model("Contact", contactSchema)
module.exports = Contact;