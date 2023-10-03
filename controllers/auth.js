const User = require('../models/user');

const renderRegisterForm = (req,res) => {
    res.render('users/register_login',{logReg:'register'})
};

const renderLoginForm = (req,res) => {
    res.render('users/register_login',{logReg:'login'});
};

const signUp = async (req,res) => {
    try{
        const{email,username,password} = req.body;
        const user = new User({email,username});
        const registerUser = await User.register(user,password);
        req.login(registerUser,(err) => {
            if(err) return next(err);
            req.flash('success','Welcome To Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error',e.message);
        res.redirect('register');
    };
};

const login = (req,res) => {
    req.flash('success','Welcome Back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};


module.exports = {renderRegisterForm,renderLoginForm,signUp,login,logout};