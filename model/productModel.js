const mongoose = require("mongoose")

//create schema
const productSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: [true, "Id is required"], 
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    price: {
        type: String,
        required: [true, "Price is required"],
    },
    discount: {
        type: String,
        required: [true, "Discount is required"],
    },
    image: {
        type: Object,
        required: [true, "Image is required"],
    },
    category:{
        type:String,
        required:[true,"Category is required"],
    },
    available:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})




//create model
const Product = mongoose.model("Product", productSchema)

module.exports = Product