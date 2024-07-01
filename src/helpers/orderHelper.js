var Order = require('../models/order');
var Basket = require('../models/basket');

async function createOrder(basket) {
    try {
        if (!validateBasket(basket)) {
            return {error: true}
        }
        basket.orderNumber = Math.floor(Math.random() * 99999).toString();
        var newOrder = new Order(basket);
        await newOrder.save();
        await Basket.findByIdAndDelete(basket._id);
        return { error: false, order: newOrder }
    } catch (e) {
        return {error: true};
    }
}

async function handlePayment(order) {
    try {
        if (!order) {
            return {success: false};
        }
        var transactionId = Math.floor(Math.random() * 99999999).toString();
        order.transactionId = transactionId;
        await order.save();
        return {success: true};
    } catch (e) {
        return {success: false}
    }
}

function validateBasket(basket) {
    var isValid = true;
    if(!basket || basket.totalPrice === 0 || basket.totalNetPrice === 0 || basket.taxPrice === 0 || basket.products.length <= 0 || !basket.shippingAddress || !basket.billingAddress || !basket.payment || !basket.email) {
        isValid = false
    }
    return isValid;
}

module.exports = {
    createOrder: createOrder,
    handlePayment: handlePayment
}