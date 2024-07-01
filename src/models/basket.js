const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
    products: [{
        id: {
            type: Number
        },
        title: {
            type: String
        },
        price: {
            type: String
        },
        description: {
            type: String
        },
        category: {
            type: String
        },
        image: {
            type: String
        },
        rating: {
            rate: {
                type: Number
            },
            count: {
                type: Number
            }
        },
        featured: {
            type: Boolean
        },
        qty: {
            type: Number
        }
    }],
    email: {
        type: String
    },
    count: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Count must be a postive number');
            }
        }
    },
    totalPrice: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Price must be a postive number');
            }
        }
    },
    shippingAddress: {
        type: Object
    },
    billingAddress: {
        type: Object
    },
    payment: {
        type: Object
    },
    shippingMethod: {
        type: String,
        required: true
    },
    shippingMethodPrice: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('ShippingMethodPrice must be a postive number');
            }
        }
    },
    taxPrice: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('TaxPrice must be a postive number');
            }
        }
    },
    totalNetPrice: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('TotalNetPrice must be a postive number');
            }
        }
    }
})

basketSchema.methods.toJSON = function() {
    var basket = this;
    var basketObj = basket.toObject();
    return basketObj;
}

const Basket = mongoose.model('Basket', basketSchema);
module.exports = Basket;
