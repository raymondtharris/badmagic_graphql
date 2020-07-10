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

    type Query {
        newsletterUsers: [NewsletterUser!]!
        newsletterUser (emailAddress: String!): NewsletterUser!
    }

    type Mutation { 
        addNewsletterUser(emailAddress: String!, firstname: String!, lastname: String!): BadMagicResponse!
        removeNewsletterUser(emailAddress: String!): BadMagicResponse! 
    }
`;

module.exports = typeDefs;