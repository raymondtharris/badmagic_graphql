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
        }, item: async (_, {id},{}) => {
            let responseBody = "";
            let statusCode = 0;

            const params = {
                TableName: "BadMagic_Item",
                Key: {
                    ID: id
                }
            }
            try{
                const data = await documentClient.get(params).promise();
                //console.log(data.Items);
                //Map array to array of NewsletterUsers

                responseBody =  {id : data.Item.ID, itemType : data.Item.ItemType, name : data.Item.Name, collection: data.Item.Collection, description: data.Item.Description, price: data.Item.Price, resourceURL: data.Item.ResourceURL}
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
        }, items: async (_,{collection, itemType},{}) => {
            //console.log(collection)
            //console.log(itemType)
            let responseBody = []
            if (collection === undefined && itemType ===undefined){
                console.log("Get all items")
                const params = {
                    TableName: "BadMagic_Item",
                }
                try {
                    const data = await documentClient.scan(params).promise()
                    //console.log(data.Items)
                    responseBody = data.Items.map( item => {
                        return {id: item.ID, itemType: item.ItemType, name: item.Name, collection: item.Collection, description: item.Description, price: item.Price, resourceURL: item.ResourceURL}
                    })
                } catch (err) {
                    console.log(err)
                }
            } if (collection === undefined && itemType !== undefined) {
                console.log("Get all of item type")
                const params = {
                    TableName: "BadMagic_Item",
                    ExpressionAttributeValues: {
                        ':t': itemType
                    },
                    FilterExpression: 'ItemType = :t'
                }
                try {
                    const data = await documentClient.scan(params).promise()
                    //console.log(data.Items)
                    responseBody = data.Items.map( item => {
                        return {id: item.ID, itemType: item.ItemType, name: item.Name, collection: item.Collection, description: item.Description, price: item.Price, resourceURL: item.ResourceURL}
                    })
                } catch (err) {
                    console.log(err)
                }
            } if (collection !== undefined && itemType === undefined){
                console.log("Get all from collection ")
                const params = {
                    TableName: "BadMagic_Item",
                    ExpressionAttributeNames: {
                        '#Collection': "Collection"
                    },
                    ExpressionAttributeValues: {
                        ':c': collection
                    },
                    FilterExpression: '#Collection = :c'
                }
                try {
                    const data = await documentClient.scan(params).promise()
                    //console.log(data.Items)
                    responseBody = data.Items.map( item => {
                        return {id: item.ID, itemType: item.ItemType, name: item.Name, collection: item.Collection, description: item.Description, price: item.Price, resourceURL: item.ResourceURL}
                    })
                } catch (err) {
                    console.log(err)
                }
            } if (collection !== undefined && itemType !== undefined) {
                console.log("Get all of type in this collection")
                const params = {
                    TableName: "BadMagic_Item",
                    ExpressionAttributeNames: {
                        '#Collection': "Collection"
                    },
                    ExpressionAttributeValues: {
                        ':c': collection,
                        ':t': itemType
                    },
                    FilterExpression: '#Collection = :c and ItemType = :t'
                }
                try {
                    const data = await documentClient.scan(params).promise()
                    //console.log(data.Items)
                    responseBody = data.Items.map( item => {
                        return {id: item.ID, itemType: item.ItemType, name: item.Name, collection: item.Collection, description: item.Description, price: item.Price, resourceURL: item.ResourceURL}
                    })
                } catch (err) {
                    console.log(err)
                }
            }
            return responseBody
        },
        order: async (_,{id},{}) => {
            //console.log(id)
            let responseBody = "";
            const params = {
                TableName: "BadMagic_Orders",
                Key: {
                    ID: id
                }
            }
            try {
                const data = await documentClient.get(params).promise()
                //console.log(data.Item)
                responseBody = {id: data.Item.ID, submitDate: data.Item.SubmitDate, firstname: data.Item.Firstname, lastname: data.Item.Lastname, emailAddress: data.Item.EmailAddress, totalPrice: data.Item.TotalPrice, status: data.Item.Status, tracking: data.Item.Tracking}

            } catch (err) {
                console.log(err)
            }
            return responseBody

        },
        user: async (_, {id},{}) => {
            console.log(id)
        },
        supportCase: async (_,{id},{}) => {
            console.log(id)
            let responseBody = "";
            const params = {
                TableName: "BadMagic_SupportCases",
                Key: {
                    ID: id
                }
            }
            try {
                const data = await documentClient.get(params).promise()
                //console.log(data.Item)
                // Add rest of the attributes
                responseBody = {id: data.Item.ID, name: data.Item.Name, emailAddress: data.Item.EmailAddress, supportDate: data.Item.SupportDate, supportMessage: data.Item.SupportMessage, supportStatus: data.Item.SupportStatus, supportResolution: data.Item.SupportResolution}

            } catch (err) {
                console.log(err)
            }
            return responseBody
        }
        
    },
    Item : {
        inventory: async (parent, {}, {}) => {
            console.log(parent.id)
            const params = {
                TableName: "BadMagic_Inventory",
                Key: {
                    ID: parent.id
                }
            }
            try{
                const data = await documentClient.get(params).promise();
                //console.log(data.Item)
                responseBody = {id : data.Item.ID, xsmall : data.Item.XSmall, small : data.Item.Small, medium : data.Item.Medium, large : data.Item.Large, xlarge : data.Item.XLarge, xxlarge : data.Item.XXLarge, xxxlarge : data.Item.XXXLarge, onesize : data.Item.OneSize};
                //console.log(responseBody)
            } catch(err){
                console.log(err)
            }
            return responseBody
        }
    },
    Order: {
        purchases: async (parent, {},{}) =>{
            //console.log(parent.id)
            responseBody = []
            const params = {
                TableName: "BadMagic_Orders",
                Key: {
                    ID: parent.id
                }
            }
            try {
                const data = await documentClient.get(params).promise();
                //console.log(data.Item.Purchases)
                responseBody = data.Item.Purchases.map( item =>{
                    //console.log(item)
                    var temp = JSON.parse(item)
                    //console.log(temp)
                    return {id: temp.ID, size: temp.Size, quantity: temp.Quantity}
                })
            } catch (err) {
                console.log(err)
            }
            return responseBody
        }
    },
    Purchase: {
        item: async (parent,{},{}) =>{
            //console.log(parent.id)
            let responseBody = "";
            let statusCode = 0;

            const params = {
                TableName: "BadMagic_Item",
                Key: {
                    ID: parent.id
                }
            }
            try{
                const data = await documentClient.get(params).promise();
                //console.log(data.Items);
                //Map array to array of NewsletterUsers

                responseBody =  {id : data.Item.ID, itemType : data.Item.ItemType, name : data.Item.Name, collection: data.Item.Collection, description: data.Item.Description, price: data.Item.Price, resourceURL: data.Item.ResourceURL}
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
        }
    },
    SupportCase: {
        supportOwner: async (parent,{},{}) => {
            console.log(parent.id)
            let userID = ""
            let responseBody = ""
            const params = {
                TableName: "BadMagic_SupportCases",
                Key: {
                    ID: parent.id
                }
            }
            try{
                const data = await documentClient.get(params).promise();
                console.log(data.Item.SupportOwner);
                //Map array to array of NewsletterUsers

                userID =  data.Item.SupportOwner
                //console.log(responseBody)
                const params2 = {
                    TableName: "BadMagic_Users",
                    Key: {
                        ID: userID
                    }
                }
                try {
                    const data = await documentClient.get(params2).promise();
                    responseBody = { id: data.Item.ID, firstname: data.Item.Firstname, access: data.Item.Access.map(item => { 
                        var jsonACL = JSON.parse(item)
                        return { name: jsonACL.Name, operations: jsonACL.ACL }}
                        )}

                } catch (err) {
                    console.log(err)
                }

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