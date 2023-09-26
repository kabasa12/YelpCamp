const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema} = require('./schema');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ObjectId = mongoose.Types.ObjectId;

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

const validateCamp = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else next();
}

app.get('/campgrounds', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}));

app.get('/campgrounds/new',(req,res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds',validateCamp,catchAsync(async (req,res) => {
    if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`)
}));

app.get('/campgrounds/:id', catchAsync(async (req,res,next) => {
    const{id} = req.params;
    if(!ObjectId.isValid(id)) return next(new ExpressError('Invalid Id',400));
    const campground = await Campground.findById(id);
    if(!campground) return next(new ExpressError('Campground Not Found',404));
    res.render('campgrounds/details',{campground})
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req,res) => {
    const {id} = req.params;
    if(!ObjectId.isValid(id)) return next(new ExpressError('Invalid Id',400));
    const editCampground = await Campground.findById(id);
    res.render('campgrounds/edit',{editCampground});
}));

app.put('/campgrounds/:id', validateCamp,catchAsync(async (req,res) => {
    const{id} = req.params;
    const editedCamp = await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true,new:true})
    res.redirect(`/campgrounds/${editedCamp._id}`);
}));

app.delete('/campgrounds/:id',catchAsync(async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id); 
    res.redirect('/campgrounds')
}));

app.post('/campgrounds/:id/reviews',catchAsync(async (req,res,next) => {
    const{id} = req.params.id;
    if(!ObjectId.isValid(id)) return next(new ExpressError('Invalid Id',400));
    const campground = await Campground.findById(id);
    console.log(campground)
}));

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