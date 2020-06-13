const express = require("express");
const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");

let courses = require("./courses");

const app = express();
const port = 8080;

//* Schema Definition Language
const schema = buildSchema(`
    type Course {
        id: ID!
        title: String!
        views: Int
    }

    input CourseInput{
        title: String!
        views: Int
    }

    type Alert{
        message: String
    }

    type Query {
        getCourses(page: Int, limit: Int = 1): [Course]
        getCourse(id: ID!): Course
    }

    type Mutation {
        addCourse(input: CourseInput): Course
        updateCourse(id: ID!, input: CourseInput): Course
        deleteCourse(id: ID!): Alert
    }
`);
//? Template string using ``
//? GraphQL '!' is required
//? getCourses() is only for arguments

const root = {
    getCourses({ page, limit }) {
        if (page !== undefined) {
            //pasaron la pagina
            //
            return courses.slice((page - 1) * limit, page * limit);
        }
        return courses;
    },
    getCourse({ id }) {
        console.log(`Course id: ${id}`);
        return courses.find((course) => id == course.id);
    },
    addCourse({ input }) {
        //const { title, views } = input;
        const id = String(courses.length + 1);
        const course = { id, ...input }; //Spread Operator
        courses.push(course);
        return course;
    },
    updateCourse({ id, input }) {
        const courseIndex = courses.findIndex((course) => id == course.id);
        const course = courses[courseIndex];
        //* valor iniciar valores a reemplazar en valor inicial
        const newCourse = Object.assign(course, input);
        course[courseIndex] = newCourse;
        return newCourse;
    },
    deleteCourse({ id }) {
        //recibe funcion, ejecuta 1 vez por elemento, si es false, el arreglo nuevo ya no lo tiene
        courses = courses.filter((course) => course.id != id);
        return {
            message: `El curso con id: ${id} fue eliminado`,
        };
    },
};

app.get("/", function(req, res) {
    res.json(courses);
});

app.listen(port, function() {
    console.log(`Starting at port: ${port}`);
});

//* MIDDLEWARE
app.use(
    "/graphql",
    graphqlHTTP({
        schema, //? if propertie && variable names equal
        rootValue: root,
        graphiql: true,
    })
);