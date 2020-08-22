const {  gql } = require('apollo-server-lambda');

const typeDefs = gql`
    type BadMagicResponse{
        success: Boolean!
        data: String
        error: String
    }

    type BadMagicStripeClientSecret{
        clientSecret: String!
        statusCode: Int!
        error: String!
    }

    type BadMagicSession{
        id: String!
    }

    type NewsletterUser {
        firstname: String!
        lastname: String!
        emailAddress: String!
    }

    type Inventory {
        id: String!
        xsmall: Int
        small: Int
        medium: Int
        large: Int
        xlarge: Int
        xxlarge: Int
        xxxlarge: Int
        onesize: Int
    }
    type BadMagicCollection{
        id: String!
        name: String!
    }

    type Item {
        id: String!
        itemType: String!
        name: String!
        collection: String!
        description: String!
        price: Int!
        resourceURL: String!
        inventory: Inventory!
    }

    type Purchase {
        id: String!
        item: Item!
        size: String!
        quantity: Int!
    }

    type Order {
        id:String!
        submitDate: String!
        purchases: [Purchase!]!
        firstname: String!
        lastname: String!
        emailAddress: String!
        totalPrice: Int!
        status: String!
        tracking: String!
    }


    type SupportCase {
        id: String!
        name: String!
        emailAddress: String!
        supportDate: String!
        supportMessage: String!
        supportOwner: User!
        supportStatus: String!
        supportResolution: String! 
    }

    type User {
        id: String!
        credentials: Credential!
        firstname: String!
        lastname: String!
        access: [Service!]

    } 

    type Credential {
        id: String!
        username: String!
        password: String!
    }

    type Service{
        name: String!
        operations:[String!]!
    }


    type Query {
        newsletterUsers: [NewsletterUser!]!
        newsletterUser (emailAddress: String!): NewsletterUser!
        inventory (id: String): [Inventory!]
        badMagicCollection(id: String): [BadMagicCollection!]!
        item (id:String!): Item!
        items (collection: String, itemType: String) : [Item!]!
        order (id: String!): Order!
        orders: [Order!]!
        supportCase (id: String!): SupportCase!
        supportCases: [SupportCase!]!
        user (id: String!): User!
        users:[User!]!
        badMagicStripeClientSecret(amount:Int!): BadMagicStripeClientSecret!
    }

    type Mutation { 
        addNewsletterUser(emailAddress: String!, firstname: String!, lastname: String!): BadMagicResponse!
        removeNewsletterUser(emailAddress: String!): BadMagicResponse! 
    }
`;

module.exports = typeDefs;