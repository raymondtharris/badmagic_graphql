const { gql } = require('apollo-server');

const typeDefs = gql`
    type BadMagicResponse{
        success: Boolean!
        data: String
        error: String
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
        totalPrice: Int!
        status: String!
        tracking: String!
    }


    type Support {
        id: String!
        name: String!
        emailAddress: String!
        supportDate: String!
        supportMessage: String!
        supportOwner: String!
        supportStatus: String!
        supportResolution: String! 
    }


    type Query {
        newsletterUsers: [NewsletterUser!]!
        newsletterUser (emailAddress: String!): NewsletterUser!
        inventory (id: String): [Inventory!]
        item (id:String!): Item!
        items (collection: String, itemType: String) : [Item!]!
        order (id: String!): Order!

    }

    type Mutation { 
        addNewsletterUser(emailAddress: String!, firstname: String!, lastname: String!): BadMagicResponse!
        removeNewsletterUser(emailAddress: String!): BadMagicResponse! 
    }
`;

module.exports = typeDefs;