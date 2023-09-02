const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter user name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter valid email']
    },
    phonenumber: {
        type: String,
        required: [true, 'Please enter Phone number'],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength:[6, 'Please enter a password of 6 letters ']
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(email, password) {
    // console.log("in static login", email, password);
    const user = await this.findOne({ email });
    if (user) {
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (passwordMatched) {
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email' );
}

module.exports = mongoose.model('user', userSchema);

