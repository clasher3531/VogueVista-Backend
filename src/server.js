const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const customerRouter = require("../src/routers/Customer");
const basketRouter = require("../src/routers/Basket");
const productRouter = require("../src/routers/Product");
const orderRouter = require("../src/routers/Order");
dotenv.config();
require("../src/db/Connection");

const server = express();
const port = process.env.PORT || 9000;

const buildPath = path.join(process.cwd(), "build");

server.use(express.static(buildPath));
server.use(express.json());
server.use(customerRouter);
server.use(basketRouter);
server.use(productRouter);
server.use(orderRouter);

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
