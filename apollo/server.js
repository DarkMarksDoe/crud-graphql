const { ApolloServer } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const courses = require("./courses");

const typeDefs = `
    type Course {
        id: ID!
        title: String!
        views: Int
    }

    input CourseInput {
        title: String!
        views: Int = 0
    }
    
    type Alert{
        message: String
    }

    type Query {
        getCourses(page: Int, limit: Int = 1 ):[Course]
        getCourse(id: ID!): Course
    }

    type Mutation {
        addCourse(input: CourseInput): Course
        updateCourse(id: ID!, input: CourseInput): Course
        deleteCourse(id: ID!): Alert
    }
`;

const resolvers = {
    Query: {
        getCourses(obj, { page, limit }) {
            if (page !== undefined) {
                //pasaron la pagina
                return courses.slice((page - 1) * limit, page * limit);
            }
            return courses;
        },
        getCourse(obj, { id }) {
            console.log(`Course id: ${id}`);
            return courses.find((course) => id == course.id);
        },
    },
    Mutation: {
        addCourse(obj, { input }) {
            //const { title, views } = input;
            const id = String(courses.length + 1);
            const course = { id, ...input }; //Spread Operator
            courses.push(course);
            return course;
        },
        updateCourse(obj, { id, input }) {
            const courseIndex = courses.findIndex((course) => id == course.id);
            const course = courses[courseIndex];
            //* valor iniciar valores a reemplazar en valor inicial
            const newCourse = Object.assign(course, input);
            course[courseIndex] = newCourse;
            return newCourse;
        },
        deleteCourse(obj, { id }) {
            //recibe funcion, ejecuta 1 vez por elemento, si es false, el arreglo nuevo ya no lo tiene
            courses = courses.filter((course) => course.id != id);
            return {
                message: `El curso con id: ${id} fue eliminado`,
            };
        },
    },
};

const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

const server = new ApolloServer({
    schema: schema,
    subscriptions: false,
});

server.listen().then(({ url }) => {
    console.log(`Servidor iniciado en ${url}`);
});