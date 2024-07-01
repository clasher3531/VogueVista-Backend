const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true
    },
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
    transactionId: {
        type: String
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

orderSchema.methods.toJSON = function() {
    var order = this;
    var orderObj = order.toObject();
    return orderObj;
}

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
