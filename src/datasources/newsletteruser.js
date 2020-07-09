const { DataSource } = require('apollo-datasource');
//const isEmail = require('isemail');

const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});
const bmdb = new AWS.DynamoDB({ apiVersion:  '2012-08-10'});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

class NewsletterUser extends DataSource {


    initialize(config) {
        this.context = config.context;
      }

    async newsletterUser({ email: emailAddress } = {}) {
        console.log(emailAddress);
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
            console.log(data);
            responseBody = JSON.stringify(data.Item);
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
    
        return response;
    }
}
module.exports = NewsletterUser;