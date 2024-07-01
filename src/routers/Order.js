const express = require('express');
const router = new express.Router();
const Order = require('../models/order');
const orderHelper = require('../helpers/orderHelper');

router.get('/order', async function(req, res) {
    try {
        var orders = await Order.find({});
        if (orders.length === 0) {
            return res.status(404).send({error: true, message: 'No order Available'});
        }
        res.send({ orders });
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.get('/order/:id', async function(req, res) {
    try {
        var order = await Order.findOne({orderNumber: req.params.orderNo});
        if (!order) {
            return res.status(404).send({error: true, message: 'No order Available'});
        }
        res.send({ order });
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.post('/order', async function(req, res) {
    try {
        var order = await orderHelper.createOrder(req.body.basket);
        if (order.error) {
            return res.status(404).send({error: true, message: 'No order Available'});
        }
        res.status(201).send({ error: false, order: order.order });
    } catch (e) {
        res.status(500).send({error: true});
    }
})

router.post('/order/payment', async function(req, res) {
    try {
        var orderRequest = req.body.order;
        var order = await Order.findById(orderRequest._id);
        if (!order) {
            return res.status(404).send({success: false, message: 'No order available', responseCode: 'REJECT'});
        }
        var handlePaymentResponse = await orderHelper.handlePayment(order);
        if (handlePaymentResponse.success) {
            return res.send({success: true, responseCode: 'AUTHORIZED'});
        }
        res.status(400).send({success: false, responseCode: 'REJECT'});
    } catch (e) {
        res.status(500).send({success: false, responseCode: 'REJECT'});
    }
})

module.exports = router;