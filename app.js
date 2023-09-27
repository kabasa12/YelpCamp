const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const campRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const exp = require('constants');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',() => {
    console.log('DataBase Connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));


const sessionConfig = {
    secret:'badsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 7 * 24,
    }

};
app.use(session(sessionConfig));
app.use(flash());

app.use('/campgrounds',campRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);



app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404));
});

app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Somthing went wrong';
    res.status(statusCode).render('error',{err});
});


app.listen(3000, () => {
    console.log('Connected to port 3000');
});