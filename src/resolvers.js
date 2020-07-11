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
                TableName: "BadMagic_NewsletterUsers"
            }
            try{
                const data = await documentClient.scan(params).promise();
                //console.log(data.Items);
                //Map array to array of NewsletterUsers

                responseBody = data.Items.map( item => {return {firstname : item.Firstname, lastname : item.Lastname, emailAddress : item.Email}})
                //console.log(responseBody)
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
        },
        inventory: async (_,{id},{}) =>{
            let responseBody = [];
            console.log( id)
            if( id === undefined){
                const params = {
                    TableName: "BadMagic_Inventory"
                }
                // need to figure how to have a null value work in DB

                try{
                    const data = await documentClient.scan(params).promise();
                    responseBody = data.Items.map( item => {
                        //console.log(data.Item.OneSize)
                        return {id: item.ID, xsmall: item.XSmall, small: item.Small, medium: item.Medium, large: item.Large, xlarge: item.XLarge, xxlarge: item.XXLarge, xxxlarge: item.XXXLarge, onesize: item.OneSize}
                    })
                } catch(err){
                    console.log(err)
                }
            } else{
                const params = {
                    TableName: "BadMagic_Inventory",
                    Key: {
                        ID: id
                    }
                }

                try{
                    const data = await documentClient.get(params).promise();
                    //console.log(data.Item)
                    responseBody = [{id : data.Item.ID, xsmall : data.Item.XSmall, small : data.Item.Small, medium : data.Item.Medium, large : data.Item.Large, xlarge : data.Item.XLarge, xxlarge : data.Item.XXLarge, xxxlarge : data.Item.XXXLarge, onesize : data.Item.OneSize}];
                    //console.log(responseBody)
                } catch(err){
                    console.log(err)
                }

            }
            return responseBody;
        }
        
    },
    Mutation : {
        addNewsletterUser : async (_, {emailAddress, firstname, lastname}, {}) => {
            //Check for emailAddress in DB 
            // if found return error else add to DB and return successful response
            //console.log(emailAddress);
            let responseBody = "";
            let responseStatus = false;
            let statusCode = 0;
            const params = [{
                    TableName: "BadMagic_NewsletterUsers",
                    Key: {
                        Email : emailAddress
                    }
                },{
                    TableName: "BadMagic_NewsletterUsers",
                    Item: {
                        Email : emailAddress,
                        Firstname : firstname,
                        Lastname : lastname
                    }
                }
            ];
            
            try{
                const data = await documentClient.get(params[0]).promise();
                //console.log(data.Item);
                if (data.Item === undefined ){
                    console.log("No user found")
                    try{
                        const resp = await documentClient.put(params[1]).promise();
                        responseStatus = true;
                        responseBody = "User has successfully been added to newsletter.";
                    } catch(err){
                        console.log(err)
                    }
                } else {
                    responseBody = "Error. User is already subscribed.";
                    responseStatus = false;
                }
                
                statusCode = 200;
            } catch(err){
                
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

            return {success: responseStatus, data:responseBody}
        },
        removeNewsletterUser : async (_, {emailAddress}, {}) => {
            //Check for emailAddress in DB 
            // if found return remove else send error response
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
                console.log(data.Item);
                if (data.Item === undefined){
                    responseBody = "No user found"
                    responseStatus = false;
                } else{
                    try {
                        const resp = await documentClient.delete(params).promise();

                        responseBody = "User has been successfully removed.";
                        responseStatus = true;
                    } catch(err) {
                        console.log(err)
                    }                  
                }
                
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

            return {success: responseStatus, data: responseBody}
        }
    }
};


module.exports = resolvers;