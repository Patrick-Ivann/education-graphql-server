/* import {
    createServer
} from 'http'
import express from 'express'

import session from "express-session";



import {
    ApolloServer
} from 'apollo-server-express'
import APOLLOSERVER from './graphql/schema.js';
const PORT = process.env.PORT || 4000

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// Connection.connectToMongo()


const app = express()


APOLLOSERVER.applyMiddleware({
    app
})

const httpServer = createServer(app)

APOLLOSERVER.installSubscriptionHandlers(httpServer)

app.use(session({
    store
    name : SESSION_NAME,
    secret : SESSION_SECRET,
    resave: false,
    saveUninitialized; false,
    cookie :{
        maxAge : SESSION_LIFETIME,
        sameSite: true,
        
    }
}));

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

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var _apolloServerExpress = require("apollo-server-express");

var _schema = _interopRequireDefault(require("./graphql/schema.js"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

require('dotenv').config()


var _CORS = require("./CORS.js");



require('./mongoDB/config');


var PORT = process.env.PORT || 4000; // Connection.connectToMongo()

var app = (0, _express.default)();


var store = new RedisStore({
    host: process.env.REDIS_STORE_HOST,
    port: process.env.REDIS_STORE_PORT,
    pass: process.env.REDIS_STORE_PASSWORD
})


const tokenRefresher = async (req, res, next) => {
    const authorization = req.headers.authorization

    if (authorization) {
        const token = authorization.split("Bearer")[1].trim()
        try {
            var user = jwt.verify(authToken.trim(), process.env.JWT_secret, {
                algorithms: "HS384"
            });
        } catch (error) {

            if (error.name === 'TokenExpiredError') {
                const payload = jwt.verify(token.trim(), process.env.JWT_secret, {
                    algorithms: "HS384",
                    ignoreExpiration: true
                });

                const refreshToken = req.headers.refreshAuthorization.split('Bearer')[1].trim()
                var [legitToken, newToken] = await generateTokens(payload);
                if (legitToken && newToken) {
                    res.set("Access-Control-Expose-Headers", "x-token", "x-refresh-token")
                    res.set("x-token", legitToken)
                    res.set("x-refresh-token", newToken)
                }
            }
        }
    }

    next()
}



app.use(tokenRefresher);

app.get('/', (req, res) => {
    res.writeHead(200, {
        Connection: 'close'
    });
    res.end(RESPONSE.MESSAGES.UP_RUNNING);
});

// Error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const {
        status
    } = err;
    res.status(status).json(err);
};

app.use(errorHandler);



app.use((0, _CORS.corsWrapper)());

// app.use(corsWrapper());

/* app.use(session({
    store,
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly:true,
        maxAge: 1200000,
        sameSite: true,

    }
})); */

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