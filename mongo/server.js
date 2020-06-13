const express = require('express');
const mongoose = require('mongoose'); //* Object Data Modelin (ODM)
const bodyParser = require('body-parser');

const { graphiqlExpress, graphqlExpress } = require('graphql-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const courseTypeDefs = require('./types/course.types');
const { merge } = require('lodash');
const courseResolvers = require('./resolvers/course.resolvers');

mongoose.connect('mongodb://localhost/graphql_db_course', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

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
    typeDefs: [typeDefs, courseTypeDefs],
    resolvers: merge(resolver, courseResolvers)
});

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));


app.listen(8080, function() {
    console.log('Server started');
});