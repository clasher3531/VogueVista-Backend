const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
})

productSchema.methods.toJSON = function() {
    var product = this;
    var productObj = product.toObject();
    return productObj;
}

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
