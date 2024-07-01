const express = require('express');
const router = new express.Router();
const Product = require('../models/product');

router.get('/products', async function(req, res) {
    try {
        var products = await Product.find({});
        if (products.length === 0) {
            res.status(404).send({error: true, message: 'No product Available'});
        }
        res.send({ products });
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.get('/product/:id', async function(req, res) {
    try {
        var product = await Product.findOne({id: req.params.id});
        if (!product) {
            res.status(404).send({error: true, message: 'No product Available'});
        }
        res.send({ product });
    } catch (e) {
        res.status(500).send({error: true});
    }
})

module.exports = router;
