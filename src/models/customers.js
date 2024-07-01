const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

customerSchema.methods.toJSON = function() {
    var customer = this;
    var customerObj = customer.toObject();

    delete customerObj.password;
    delete customerObj.tokens;

    return customerObj;
}

customerSchema.methods.generateAuthToken = async function() {
    var customer = this;
    var token = jwt.sign({_id: customer._id.toString()}, process.env.TOKEN_SIGN);
    customer.tokens = customer.tokens.concat({ token });
    await customer.save();
    return token;
}

customerSchema.statics.findByCredentials = async function(email, password) {
    if (!email || !password) {
        throw new Error('Unable to login');
    }

    var customer = await Customer.findOne({email});

    if (!customer) {
        throw new Error('Unable to login');
    }

    var isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return customer;
}

customerSchema.pre('save', async function(next) {
    var customer = this;

    if (customer.isModified('password')) {
        customer.password = await bcrypt.hash(customer.password, 8);
    }

    next();
})

const Customer = mongoose.model('Customer', customerSchema);

Customer.createIndexes();

module.exports = Customer;