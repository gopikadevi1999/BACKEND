const express = require('express')
const productModel = require('../model/productModel');

const router = express.Router();


//addproduct
router.post('/addproduct', async (req, res) => {
    try {
        const products = await productModel.find({});
        let id;
        if (products.length > 0) {
            let last_product_array = products.slice(-1)
            let last_product = last_product_array[0]
            id = last_product.id + 1
        }
        else {
            id = 1
        }

        const newProduct = new productModel({
            id: id,
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            image: req.body.image,
            category: req.body.category,
        })
        await newProduct.save();
        res.json({
            status: true,
            message: "Product added successfully"
        })
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        })
    }
})

//get product id to edit product
router.get('/editproduct/:id', async (req, res) => {
    try {
        const product = await productModel.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({
                status: false,
                message: 'Product not found'
            });
        }
        res.send(product);
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }  
});

//update product
// Update product
router.post('/updateproduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body; // Assuming the request body contains updated product data

        // Find the product by ID
        const product = await productModel.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({
                status: false,
                message: 'Product not found'
            });
        }

        // Update product fields
        product.name = updatedData.name;
        product.price = updatedData.price;
        product.discount = updatedData.discount;
        product.image = updatedData.image;
        product.category = updatedData.category;

        // Save the updated product
        await product.save();

        res.json({
            status: true,
            name: product.name // Returning the updated product name as an example
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});


//removeproduct
router.post('/removeproduct', async (req, res) => {
    try {
        await productModel.findOneAndDelete({ id: req.body.id });
        res.json({
            status: true,
            name: req.body.name,
            message: "Product removed successfully"
        })
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        })
    }
})

//allproducts
router.get('/allproducts', async (req, res) => {
    try {
        const products = await productModel.find({});
        res.send(products)
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        })
    }
})


//fetch user cart data
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            req.user = data.user
            next()
        }
        catch (error) {
            res.status(401).send({ error: "Please authenticate using a valid token" })
        }
    }
}

//addcart
router.post('/addcart', fetchUser, async (req, res) => {
    const userData = await User.findOne({ _id: req.user.id })
    userData.cartData[req.body.product] = userData.cartData[req.body.product] + 1
    await User.findOneAndUpdate({ _id: req.user.id }, {
        cartData: userData.cartData
    })
    res.send({
        status: true,
        message: "Product added to cart successfully"
    })
})


//removecart
router.post('/removecart', fetchUser, async (req, res) => {
    const userData = await User.findOne({ _id: req.user.id })
    if (userData.cartData[req.body.product] > 0) {
        return res.send({
            status: false,
            message: "Product already removed from cart"
        })
    }
    userData.cartData[req.body.product] = userData.cartData[req.body.product] - 1
    await User.findOneAndUpdate({ _id: req.user.id }, {
        cartData: userData.cartData
    })
    res.send({
        status: true,
        message: "Product removed from cart successfully"
    })
})


//get cart data
router.get('/getcart', fetchUser, async (req, res) => {
    const userData = await User.findOne({ _id: req.user.id })
    res.send({
        status: true,
        cartData: userData.cartData
    })
})

//product category 
router.post('/productcategory', async (req, res) => {
    try {
        const products = await productModel.find({ category: req.body.category });
        res.send(products)
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        })
    }
})


module.exports = router