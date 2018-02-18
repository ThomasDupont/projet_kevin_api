require('dotenv').config();
const express = require('express');
const app = express();
const CONF = require('./config/conf');
const controllerFactory = require('./app/ControllerFactory');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const schema = require('./config/graphQlSchema');
const mongoose = require('mongoose');
const cors = require('cors');

/**
 * Main class
 *
 * @author Thomas Dupont
 */
class Main {
    constructor() {
        mongoose.connect(process.env.MONGODB_URI, {
            promiseLibrary: global.Promise,
        });
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

        app.use(bodyParser.urlencoded({extended: false}));
        // parse application/json
        app.use(bodyParser.json());
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', "*");
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            // Pass to next layer of middleware
            next();
        });

        app.options('/graphql', cors());
        app.use('/graphql', graphqlHTTP({
            schema : buildSchema(schema),
            rootValue: this.initRoot(),
            graphiql: true,
        }));

        this.initRouter();

        app.listen(process.env.PORT || 3000, () => {
            console.log('creadolphin api launched');
        });
    }

    initRoot() {
        return {
            getWebDesignList: (request) => {
                return this.render('Webdesign', 'getList', request);
            },
            getWebDesign: (request) => {
                return this.render('Webdesign', 'getSingleWebdesign', request);
            }
        };
    }

    initRouter() {
    }

    /**
     *
     * @param c Controller
     * @param m Method
     * @param req The request
     * @param res The reponse event
     */
    async render(c, m, req, res) {
        return await controllerFactory.init(c, m, req);
    }
}

new Main();

module.exports = app;