const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true },
    birthday: { type: String, require: true },

})

const Login = model('login', userSchema);
module.exports = Login;