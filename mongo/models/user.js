const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const hash = require("lodash");
const jwt = require('jsonwebtoken');
const secret = require("../libs/env");

const userSchema = new mongoose.Schema({
    email: String,
    hashedPassword: {
        type: String,
    },
    token: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }, ],
});

userSchema.virtual("password");

userSchema.pre("validate", async function() {
    if (this.password === undefined) return;
    try {
        const hash = await bcrypt.hash(this.password, 10);
        console.log(hash, this.password);
        this.hashedPassword = hash;
    } catch (err) {
        console.log(err);
        throw err;
    }
});

userSchema.statics.authenticate = async function({ email, password }) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('Email or password are grong');
    const resul = await bcrypt.compare(password, user.hashedPassword);
    if (!resul) throw new Error('Email or password are grong');
    //? JSON Web Tokens (JWT)
    user.token = jwt.sign({ id: user.id }, secret.secret);
    await user.save();
    return user;
};
//* User Authenticate

module.exports = mongoose.model("User", userSchema);