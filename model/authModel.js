const mongoose = require('mongoose');

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
//create schema
const authSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: [true, "Password is required"],
        unique: true
    },
    status:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        default:"user"
    },
    cartData:{
        type : Object
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

const Auth = mongoose.model("Auth", authSchema)
module.exports = Auth;