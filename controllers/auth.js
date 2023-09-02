const User = require('../models/user');
const jwt = require('jsonwebtoken');


const handleSignupErrors = (err) => {
   
    console.log(JSON.stringify(err));
    let errors = {};
    if (err.errors) {
        for (let key in err.errors) {
            errors[key] = err.errors[key].message;
        }
    }
    return errors;
}

// const handleLoginErrors = (err) => {
//     console.log(err);
//     let errors = {};
//     if (err.errors) {
//         for (let key in err.errors) {
//             errors[key] = err.errors[key].message;
//         }
//     }
//     return errors;
   
// }
const handleLoginErrors = (err) => {
    console.log(err.message, err.code);
        let errors = {email:'', password:''};
            if(err.code === 11000){
                errors.email = ' This email is already registered';
                return errors;
            }
            if(err.message === 'Incorrect Email'){
                errors.email = ' This email is not registered';
               
            }
            if(err.message === 'Incorrect Password'){
                errors.password = ' This password is incorrect';
                
            }

   
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
}

const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'hello', {
        expiresIn: maxAge
    })
}


exports.getHome = (req, res, next) => {
    res.render('home');
    next();
    
}

exports.getAfterLogin = (req, res, next) => {
    res.render('afterlogin');
    next();
}


exports.getSignup = (req, res, next) => {
    res.render('signup');
    next();
    
}

exports.getLogin = (req, res, next) => {
    res.render('login');
    next();
    
}

exports.postSignup = async (req, res, next) => {
    // console.log("New request for POST /signup");
    // console.log(req.body);
    const { name, phonenumber, email, password} = req.body;

    try {
        const user = await User.create({ name, phonenumber, email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });
        res.status(210).json({ user: user._id})
    }
    catch(err) {
        const errors = handleSignupErrors(err);
        // console.log(errors);
        return res.status(400).json({errors});
    };
}

exports.postLogin = async (req, res) => {
        // console.log("New request for POST /login");
        // console.log(JSON.stringify(req.body));
    const { email, password } = req.body;
        // console.log(email);
        // console.log(password);
    
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id});
    }
    catch(err) {
        const errors = handleLoginErrors(err);
            // console.log(errors);
        res.status(400).json({errors});
    };
}

    
exports.getLogout = (req, res, next) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/');

    
}
