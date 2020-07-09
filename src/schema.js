const { gql } = require('apollo-server');

const typeDefs = gql`
    type NewsletterUser {
        firstname: String!
        lastname: String
        emailAddress: String!
    }

    type Query {
        newsletterUsers: [NewsletterUser!]!
        newsletterUser (emailAddress: String!): NewsletterUser!
    }

    type Mutation { 
        addNewsletterUser(emailAddress: String!, firstname: String!, lastname: String): String!
    }
`;

module.exports = typeDefs;