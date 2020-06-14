const express = require("express");
const mongoose = require("mongoose"); //* Object Data Modelin (ODM)
const bodyParser = require("body-parser");
const auth = require("./libs/auth");


//* const { graphiqlExpress, graphqlExpress } = require("graphql-server-express");
const { ApolloServer } = require("apollo-server-express");

const { merge } = require("lodash");

//* Courses
const courseTypeDefs = require("./types/course.types");
const courseResolvers = require("./resolvers/course.resolvers");

//* Users
const userTypeDefs = require("./types/user.types");
const userResolvers = require("./resolvers/user.resolvers");

mongoose.connect("mongodb://localhost/graphql_db_course", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const app = express();

const typeDefs = `
    type Alert{
        message: String
    }

    type Query{
        _ : Boolean
    }

    type Mutation{
        _ : Boolean
    }
    `;

const resolver = {};
//* app.use("/graphql", bodyParser.json(), graphqlExpress({ schema: schema }));
//* app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

const server = new ApolloServer({
    typeDefs: [typeDefs, courseTypeDefs, userTypeDefs],
    resolvers: merge(resolver, courseResolvers, userResolvers),
    context: auth
});
server.applyMiddleware({ app: app });

app.listen(8080, function() {
    console.log("Server started");
});