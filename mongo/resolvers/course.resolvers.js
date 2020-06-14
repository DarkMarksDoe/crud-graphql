const Course = require("../models/course");
const User = require("../models/user");

module.exports = {
    Query: {
        async getCourses(obj, { page, limit }) {
            let courses = Course.find();
            if (page !== undefined) {
                courses = courses.limit(limit).skip((page - 1) * limit, page * limit);
            }
            return await courses;
        },
        async getCourse(obj, { id }) {
            console.log(`Course id: ${id}`);
            const course = await Course.findById(user);
            return course;
        },
    },
    Mutation: {
        async addCourse(obj, { input, user }) {
            const userObj = await User.findById(user);
            const course = new Course({...input, user });
            await course.save();
            userObj.courses.push(course);
            await userObj.save();
            return course;
        },
        async updateCourse(obj, { id, input }) {
            await Course.findByIdAndUpdate(id, input);
            const course = await Course.findById(id);
            return course;
        },
        async deleteCourse(obj, { id }) {
            //recibe funcion, ejecuta 1 vez por elemento, si es false, el arreglo nuevo ya no lo tiene
            const es = await Course.findByIdAndDelete(id);
            if (es == null) {
                return { message: `El curso con id: ${id} no existe` };
            }
            return {
                message: `Se elimino curso con id: ${id}`,
            };
        },
    },
    Course: {
        async user(c) {
            return await User.findById(c.user);
        }
    }
};