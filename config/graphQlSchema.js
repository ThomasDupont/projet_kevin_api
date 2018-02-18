const createType = require('mongoose-schema-to-graphql');
const webdesignSchema = require('./../src/DocumentComponent/Model/WebDesign');
const graphql = require('graphql');

/*
const WebDesignConfig = {
    name: 'WebDesign',
    description: 'WebDesign schema',
    class: 'GraphQLObjectType',
    schema: webdesignSchema,
    exclude: ['_id']
};
*/

const schema = `
    type WebDesign {
        _id : String,
        title: String,
        description: String,
        screenPath: [String],
        profilPictureCreator: String,
        creatorName: String,
        tags: [String],
        colors: [String],
        websiteLink: String,
        createdAt: String,
    }
    
    type Query {
        getWebDesignList(page : Int): [WebDesign]
        getWebDesign(id : String): WebDesign
    }
`;

//module.exports = createType(WebDesignConfig);
module.exports = schema;

