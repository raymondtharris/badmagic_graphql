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
        xsmall: Int!
        small: Int!
        medium: Int!
        large: Int!
        xlarge: Int!
        xxlarge: Int!
        xxxlarge: Int!
        onesize: Int!
    }

    type Item {
        id: String!
        itemType: String!
        name: String!
        collection: String!
        description: String!
        price: Int!
        resourceURL: String!
        stock: Inventory!
    }

    type Query {
        newsletterUsers: [NewsletterUser!]!
        newsletterUser (emailAddress: String!): NewsletterUser!
        inventory (id: String): [Inventory!]!

    }

    type Mutation { 
        addNewsletterUser(emailAddress: String!, firstname: String!, lastname: String!): BadMagicResponse!
        removeNewsletterUser(emailAddress: String!): BadMagicResponse! 
    }
`;

module.exports = typeDefs;