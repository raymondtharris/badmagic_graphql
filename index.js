'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});

const { ApolloServer } = require('apollo-server-lambda');
const typeDefs = require('./src/schema');
//const { NewsletterUser } =  require('./src/datasources/newsletteruser');
const resolvers = require('./src/resolvers');


const server = new ApolloServer({ typeDefs,resolvers, 
});

//const bmdb = new AWS.DynamoDB({ apiVersion:  '2012-08-10'});
//const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});
/*
var schema = buildSchema(`
    type NewsletterUser{
        firstname: String!
        lastname: String!
        emailAddress: String!
    }
    type Query{
        newsletterUsers: [NewsletterUser!]!
        newsletterUser(emailAddress: String!): String!
    }
`);

var root = {

    newsletterUsers: () => { 
        return '[raymondtimothyharris@badmagic.com2]';
    },
    newsletterUser:  async ({ emailAddress }) => { 
        
        console.log(emailAddress);
        const params = {
            TableName: "BadMagic_NewsletterUsers",
            Key: {
                Email : emailAddress
            }
        }
        const data = await documentClient.get(params).promise();
        console.log(data);
        return "Testing things"
    }
};
*/
exports.graphqlHandler = server.createHandler();
/*
server.listen().then(({ url }) => {
    console.log(`Bad Magic api ready at ${url}`);
  });
*/
/*async (event, context) => {

    //console.log(event.query);
    graphql(schema, event.query ,root)
    .then((response) => {
        console.log(response)
    });
   
    //return response;
}
*/