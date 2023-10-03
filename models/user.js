const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMangoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        uniqeue:true
    }
});

UserSchema.plugin(passportLocalMangoose); //sets user name & password

module.exports = mongoose.model('User',UserSchema);