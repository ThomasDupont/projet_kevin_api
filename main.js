require('dotenv').config();
global.ROOT             = __dirname;
const express           = require('express');
const app               = express();
const CONF              = require('./config/conf');
const controllerFactory = require('./app/ControllerFactory');
const bodyParser        = require('body-parser');

/**
 * Main class
 *
 * @author Thomas Dupont
 */
class Main {
    constructor ()
    {
        app.use(bodyParser.urlencoded({ extended: false }));
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

        this.initRouter();

        app.listen(3000, () => {
            console.log('launched');
        });
    }

    initRouter()
    {
        app.get(CONF.APIURL, (req, res) => {
            this.render('Main', 'main', req, res);
        });
    }

    /**
     *
     * @param c Controller
     * @param m Method
     * @param req The request
     * @param res The reponse event
     */
    async render (c, m, req, res)
    {
        let result = await controllerFactory.init(c, m, req);
        res.status(result.statusCode);
        res.send(result);
    }
}

new Main();

module.exports = app;