const { model } = require("mongoose");
const courses = [];
const Course = require("../models/course");
const { findById } = require("../models/course");
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
            const course = await Course.findById(id);
            return course;
        },
    },
    Mutation: {
        async addCourse(obj, { input }) {
            const course = new Course(input);
            await course.save();
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
};