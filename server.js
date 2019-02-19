const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

// // const renameRouterFileLater = require('./routerName/renameRouterFileLater');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));

// server.use("/api/RouterNameFromAbove", RouterNameFromAbove);

module.exports = server;
