const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const customerRouter = require("../src/routers/Customer");
const basketRouter = require("../src/routers/Basket");
const productRouter = require("../src/routers/Product");
const orderRouter = require("../src/routers/Order");

dotenv.config();
require("../src/db/Connection");

const server = express();
const port = process.env.PORT || 9000;

// CORS options to allow requests from frontend running on port 3000
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS, // Allow only requests from this origin
  methods: "GET,POST,PATCH,DELETE", // Allow only these methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
};

// Use CORS middleware with specified options
server.use(cors(corsOptions));

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
