const express = require('express');
const router = new express.Router();
const Customer = require('../models/customers');
const auth = require('../middleware/auth');

router.post('/Customer', async function (req, res) {
    try {
        var customer = new Customer(req.body);
        var token = await customer.generateAuthToken();
        res.status(201).send({customer, token});
    } catch(e) {
        res.status(400).send(e);
    }
})

router.get('/Customer/me', auth, async function (req, res) {
    try {
      res.send(req.customer);
    } catch (e) {
      res.status(500).send();
    }
})

router.patch('/Customer/me', auth, async function (req, res) {
    var updates = Object.keys(req.body);
    var allowedUpdates = ['name', 'age', 'email', 'password'];
    var isvalidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isvalidOperation) {
        res.status(400).send({'error': 'Not a valid operation'});
    }
    try {
      var customer = req.customer

      updates.forEach((update) => {
        customer[update] = req.body[update];
      })
      await customer.save();
      res.send(customer);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.delete('/Customer/me', auth, async function(req, res) {
    try {
      await req.customer.remove();
      res.send(req.customer);
    } catch (e) {
      res.status(500).send(e)
    }
})

router.post('/Customer/login', async function(req, res) {
    try {
        var customer = await Customer.findByCredentials(req.body.email, req.body.password);
        var token = await customer.generateAuthToken();
        res.send({customer, token});
    } catch(e) {
        res.status(400).send(e);
    }
})

router.post('/Customer/logout', auth, async function(req, res) {
    try {
        var customer = req.customer;
        customer.tokens = customer.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await customer.save();
        res.send();
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/Customer/logoutAll', auth, async function(req, res) {
  try {
      var customer = req.customer;
      customer.tokens = [];
      await customer.save();
      res.send();
  } catch (e) {
      res.status(500).send(e)
  }
})

module.exports = router;
