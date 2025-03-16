const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({


    userType: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

});


userSchema.statics.signup = async function (userType, name, phoneNumber, email, password) {
    if (!userType || !name || !phoneNumber || !email || !password) {
        throw Error("All fields must be filled");
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Creating user
    const user = await this.create({ userType, name, phoneNumber, email, password: hash });
    return user;
};


module.exports = mongoose.model("User", userSchema);

