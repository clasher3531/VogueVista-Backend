const express = require('express');
const router = new express.Router();
const Basket = require('../models/basket');
const basketHelper = require('../helpers/basketHelper');
const Product = require('../models/product');

router.get('/basket/:id', async function(req, res) {
    try {
        var basket = await Basket.findById(req.params.id);
        if (basket.length === 0) {
            return res.status(404).send({error: true, message: 'No basket Available'})
        }
        res.send({ basket })
    } catch (e) {
        res.status(500).send({error: true})
    }
})

router.post('/basket', async function(req, res) {
    try {
        var basketResponse = await basketHelper.getOrNewBasket(req.body.basketUUID);
        if (basketResponse.error) {
            res.status(400).send({error: true, message: 'unable to create basket'});
        }
        res.send({basket: basketResponse.basket});
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.patch('/basket', async function(req, res) {
    try {
        var allowedUpdates = ['shippingAddress', 'billingAddress', 'email', 'payment'];
        var updates = Object.keys(req.body.updates);
        var isvalidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isvalidOperation) {
            return res.status(400).send({error: true, message: 'Not a valid operation'});
        }
        var basket = await basketHelper.getBasket(req.body.basketUUID);
        basket = basket.basket;
        if (!basket) {
            return res.status(404).send({error: true, message: 'Unable to create basket'});
        }
        updates.forEach((update) => {
            basket[update] = req.body.updates[update];
          })
        await basket.save();
        res.send(basket);
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.delete('/basket/:id', async function(req, res) {
    try {
        var basket = await Basket.findByIdAndDelete(req.params.id);
        if (!basket) {
            return res.status(404).send({error: true, message: 'No basket available with id: ' + req.params.id});
        }
        res.send(basket);
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.post('/basket/addProduct', async function(req, res) {
    try {
        var basketResponse = await basketHelper.getOrNewBasket(req.body.basketUUID);
        if (basketResponse.error && !basketResponse.basket) {
            return res.status(400).send({error: true, message: 'unable to create basket'});
        }
        var product = await Product.findOne({id: req.body.pid});
        if (!product) {
            return res.status(404).send({error: true, message: 'product not found'});
        }
        basketResponse = basketHelper.addProductToBasket(basketResponse.basket, product);
        await basketResponse.save();
        res.send(basketResponse);
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.post('/basket/removeProduct', async function(req, res) {
    try {
        var basketResponse = await basketHelper.getBasket(req.body.basketUUID);
        if (basketResponse.error && !basketResponse.basket) {
            return res.status(400).send({error: true, message: 'unable to create basket'});
        }
        basketResponse = basketHelper.removeProductFromBasket(basketResponse.basket, req.body.pid);
        await basketResponse.save();
        res.send(basketResponse);
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.post('/basket/updateShippingMethod', async function(req, res) {
    try {
        var basketResponse = await basketHelper.getBasket(req.body.basketUUID);
        if (basketResponse.error && !basketResponse.basket) {
            return res.status(400).send({error: true, message: 'unable to create basket'});
        }
        basketResponse = basketHelper.updateShippingMethod(basketResponse.basket, req.body.shippingMethod);
        await basketResponse.save();
        res.send(basketResponse);
    } catch (e) {
        res.status(500).send({error: true});
    }
})

module.exports = router;