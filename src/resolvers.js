const { gql } = require('apollo-server');

const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});
const bmdb = new AWS.DynamoDB({ apiVersion:  '2012-08-10'});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

const resolvers = {
    Query : {
        newsletterUser : async (_,{emailAddress}, {}) => {
            //console.log(emailAddress);
            let responseBody = "";
        
            let statusCode = 0;
            const params = {
                TableName: "BadMagic_NewsletterUsers",
                Key: {
                    Email : emailAddress
                }
            }
            try{
                const data = await documentClient.get(params).promise();
                //console.log(data.Item);
                responseBody = data.Item;
                statusCode = 200;
            } catch(err){
                console.log(err);
                responseBody = `Item not Found.`
                statusCode = 403
            }
            const response = {
                statusCode:statusCode,
                headers:{
                    "myHeader":"test",
                    "Access-Conrol-Allow-Origin":"*"
                },
                body: responseBody
            }

            return {firstname : responseBody.Firstname, lastname : responseBody.Lastname, emailAddress : responseBody.Email}
        },
        newsletterUsers : async(_,{},{}) => {
            let responseBody = [];
            let statusCode = 0;

            const params = {
                TableName: "BadMagic_NewsletterUsers",
                Limit:3
            }
            try{
                const data = await documentClient.scan(params).promise();
                console.log(data.Items);
                //Map array to array of NewsletterUsers

                responseBody = data.Items.map({Firstname, Lastname, Email})
                console.log(responseBody)
                statusCode = 200;
            }   catch (err){
                console.log(err)
                responseBody = `Unable to get Items`
                statusCode = 403
            }

            const response = {
                statusCode:statusCode,
                headers:{
                    "myHeader": "test",
                    "Access-Control-Allow-Origin": "*"
                },
                body : responseBody
            }

            return responseBody;
        }

    },
};


module.exports = resolvers;