const express = require('express');
const stripe = require('stripe')("sk_test_51Ovzg5SCmubRBWWYCb6nYPlzSYxTDm1dzagPGuJN6fNdBlsxomZ3B1lAsu1yfuKG48Z4qyGTqngwDft5VHREhQSb00FWflKW3I")

const router = express.Router();

//strip checkout session and get cart items also total price of cart
router.post('/create-checkout-session', async (req, res) => {
    const {products} = req.body
    // console.log(products)
    const lineItems = products.map((product) => ({
        price_data: {
            currency: 'usd',
            product_data : {
                name: product.name,
            },
            unit_amount: product.discount * 100
        },
        quantity: product.qty,

    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:5174/success',
        cancel_url: 'http://localhost:5174/cancel',
    })
    res.json({id: session.id})
})


module.exports = router
