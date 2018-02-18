require('dotenv').config();
const express = require('express');
const app = express();
const CONF = require('./config/conf');
const controllerFactory = require('./app/ControllerFactory');
const bodyParser = require('body-parser');
var graphqlHTTP = require('express-graphql');
var {buildSchema} = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`

    input MessageInput {
      content: String
      author: String
    }
    
    type Message {
      id: ID!
      content: String
      author: String
    }
    
    type Mutation {
      createMessage(input: MessageInput): Message
      updateMessage(id: ID!, input: MessageInput): Message
    }
    
    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }
    
    type Query {
        getMessage(id : String): Message
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
        rollDice(numDice: Int!, numSides: Int): [Int]
        getDie(numSides: Int): RandomDie
    }
`);

// If Message had any complex fields, we'd put them on this object.
class Message {
    constructor(id, {content, author}) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

// This class implements the RandomDie GraphQL type
class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({numRolls}) {
        var output = [];
        for (var i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }
}

var fakeDatabase = {};

// The root provides a resolver function for each API endpoint
var root = {
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
    },
    random: () => {
        return Math.random();
    },
    rollThreeDice: () => {
        return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
    },
    rollDice: function ({numDice, numSides}) {
        var output = [];
        for (var i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    },
    getDie: function ({numSides}) {
        return new RandomDie(numSides || 6);
    },
    getMessage: function ({id}) {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        return new Message(id, fakeDatabase[id]);
    },
    createMessage: function ({input}) {
        // Create a random id for our "database".
        var id = require('crypto').randomBytes(10).toString('hex');

        fakeDatabase[id] = input;
        return new Message(id, input);
    },
    updateMessage: function ({id, input}) {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        // This replaces all old data, but some apps might want partial update.
        fakeDatabase[id] = input;
        return new Message(id, input);
    },
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

/**
 * Main class
 *
 * @author Thomas Dupont
 */
class Main {
    constructor() {
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

        this.initRouter();

        app.listen(3000, () => {
            console.log('creadolphin api launched');
        });
    }

    initRouter() {
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
    async render(c, m, req, res) {
        let result = await controllerFactory.init(c, m, req);
        res.status(result.statusCode);
        res.send(result);
    }
}

new Main();

module.exports = app;
