const express = require("express");
const mongoose = require("mongoose"); //* Object Data Modelin (ODM)
const bodyParser = require("body-parser");

const { graphiqlExpress, graphqlExpress } = require("graphql-server-express");
const { makeExecutableSchema } = require("graphql-tools");
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

const schema = makeExecutableSchema({
    typeDefs: [typeDefs, courseTypeDefs, userTypeDefs],
    resolvers: merge(resolver, courseResolvers, userResolvers),
});

app.use("/graphql", bodyParser.json(), graphqlExpress({ schema: schema }));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.listen(8080, function() {
    console.log("Server started");
});