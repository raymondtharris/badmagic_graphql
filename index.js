'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});

const {
      graphql,
      GraphQLSchema,
      GraphQLObjectType,
      GraphQLString,
      GraphQLNonNull
    } = require('graphql');

exports.handler = async (event, context) => {
    const bmdb = new AWS.DynamoDB({ apiVersion:  '2012-08-10'});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});
    
    let responseBody = "";
    let statusCode = 0;

    const params = {
        TableName: "BadMagic_ShopItem",
        Limit:3
    }
    try{
        const data = await documentClient.scan(params).promise();
        console.log(data);
        responseBody = JSON.stringify(data.Items);
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

    return response;

}