var Basket = require('../models/basket');
var Constants = require('../Config/Constants.json');

function getNewBasketPayload() {
    var basket = {
        products: [],
        count: 0,
        totalPrice: 0,
        shippingAddress: {},
        billingAddress: {},
        payment: {},
        email: "",
        shippingMethod: "Standard Delivery",
        shippingMethodPrice: 0,
        taxPrice: 0,
        totalNetPrice: 0
    }
    return basket;
}

async function getBasket(basketUUID) {
    try {
        var basket = basketUUID ? await Basket.findById(basketUUID) : [];
        if (basket.length === 0) {
            return { error: true }
        }
        return { error: false, basket: basket}
    } catch (e) {
        return {error: true};
    }
}

async function getOrNewBasket(basketUUID) {
    try {
        var basket = basketUUID ? await Basket.findById(basketUUID) : [];
        if (basket.length === 0) {
            var basketPayload = getNewBasketPayload();
            var newBasket = new Basket(basketPayload);
            await newBasket.save();
            return { error: false, basket: newBasket }
        }
        return { error: false, basket: basket}
    } catch (e) {
        return {error: true};
    }
}

function getTotalPrice(basket) {
    var price = 0
    if (basket && basket.products && basket.products.length) {
        basket.products.forEach(function(product) {
            price += (parseFloat(product.price) * (product.qty));
        })
    }
    return price.toString();
}

function calculateTotalNetPrice(price) {
    var netPrice = price + ((Constants.taxPercentage * price)/100);
    return parseFloat(netPrice).toFixed(2).toString();
}

function calculateTax(price) {
    var taxPrice = (Constants.taxPercentage * price)/100;
    return parseFloat(taxPrice).toFixed(2).toString();
}

function addProductToBasket(basket, product) {
    if (!basket || !product) {
        return null;
    } else {
        var isProductFound = false;
        basket.products.forEach(function (prod) {
            if(prod.id === product.id) {
                prod.qty += 1;
                isProductFound = true
            }
        })
        if (!isProductFound) {
            product.qty = 1;
            basket.products.push(product);
        }
        var totalPrice = getTotalPrice(basket);
        basket.totalPrice = parseFloat(totalPrice).toFixed(2).toString();
        basket.totalNetPrice = calculateTotalNetPrice(parseFloat(totalPrice));
        basket.taxPrice = calculateTax(parseFloat(totalPrice));
        basket.count = basket.products.length;
        return basket;
    }
}

function removeProductFromBasket(currentBasket, pid) {
    if (!currentBasket || !pid) {
        return null;
    }
    var productPrice = 0;
    var qty = 0;
    currentBasket.products = currentBasket.products.filter((product) => {
        if (product.id === pid) {
            productPrice = product.price;
            qty = product.qty;
        }
        return product.id !== pid;
    })
    currentBasket.totalPrice = (currentBasket.totalPrice - (parseFloat(productPrice) * qty)).toString();
    currentBasket.totalPrice = parseFloat(currentBasket.totalPrice).toFixed(2).toString();
    currentBasket.totalNetPrice = calculateTotalNetPrice(parseFloat(currentBasket.totalPrice));
    currentBasket.taxPrice = calculateTax(parseFloat(currentBasket.totalPrice));
    currentBasket.count = currentBasket.products.length;
    return currentBasket;
}

function updateShippingMethod(currentBasket, method) {
    if (!currentBasket || !method) {
        return null;
    }
    if (method === Constants.STDMETHOD && currentBasket.shippingMethod === Constants.SATMETHOD) {
        currentBasket.shippingMethod = method;
        currentBasket.shippingMethodPrice = Constants.stdDeliveryPrice;
        currentBasket.totalNetPrice = parseFloat(parseFloat(currentBasket.totalNetPrice) - Constants.satDeliveryPrice).toFixed(2).toString();
    } else if (method === Constants.SATMETHOD && currentBasket.shippingMethod === Constants.STDMETHOD) {
        currentBasket.shippingMethod = method;
        currentBasket.shippingMethodPrice = Constants.satDeliveryPrice;
        currentBasket.totalNetPrice = parseFloat(parseFloat(currentBasket.totalNetPrice) + Constants.satDeliveryPrice).toFixed(2).toString();
    }
    return currentBasket;
}

module.exports = {
    getNewBasketPayload: getNewBasketPayload,
    getOrNewBasket: getOrNewBasket,
    addProductToBasket: addProductToBasket,
    removeProductFromBasket: removeProductFromBasket,
    updateShippingMethod: updateShippingMethod,
    getBasket: getBasket
}