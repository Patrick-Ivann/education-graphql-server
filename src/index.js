/* import {
    createServer
} from 'http'
import express from 'express'



import {
    ApolloServer
} from 'apollo-server-express'
import APOLLOSERVER from './graphql/schema.js';
const PORT = process.env.PORT || 4000


// Connection.connectToMongo()


const app = express()


APOLLOSERVER.applyMiddleware({
    app
})

const httpServer = createServer(app)

APOLLOSERVER.installSubscriptionHandlers(httpServer)


app.use('/fdt', express.static(__dirname + '/images'));

httpServer.listen({
    port: PORT
}, () => {
    console.log(`server ready at http://localhost:${PORT}${APOLLOSERVER.graphqlPath}`)
    console.log(`Subscriptions ready at ws://localhost:${PORT}${APOLLOSERVER.subscriptionsPath}`)
}) */


"use strict";

var _http = require("http");

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _schema = _interopRequireDefault(require("./graphql/schema.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config()


var PORT = process.env.PORT || 4000; // Connection.connectToMongo()

var app = (0, _express.default)();


_schema.default.applyMiddleware({
  app: app
});

var httpServer = (0, _http.createServer)(app);

_schema.default.installSubscriptionHandlers(httpServer);

app.use('/fdt', _express.default.static(__dirname + '/images'));
httpServer.listen({
  port: PORT
}, function () {
  console.log("server ready at http://localhost:".concat(PORT).concat(_schema.default.graphqlPath));
  console.log("Subscriptions ready at ws://localhost:".concat(PORT).concat(_schema.default.subscriptionsPath));
});