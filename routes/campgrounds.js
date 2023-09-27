const express = require('express');
//const mongoose = require('mongoose');
const router = express.Router();
//const ObjectId = mongoose.Types.ObjectId;

const {campgroundSchema} = require('../schema');
const Campground = require('../models/campground');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const validateCamp = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else next();
};


router.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}));

router.get('/new',(req,res) => {
    res.render('campgrounds/new');
});

router.post('/',validateCamp,catchAsync(async (req,res) => {
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`)
}));

router.get('/:id', catchAsync(async (req,res,next) => {
    const{id} = req.params;
    //if(!ObjectId.isValid(id)) return next(new ExpressError('Invalid Id',400));
    const campground = await Campground.findById(id).populate('reviews');
    //if(!campground) return next(new ExpressError('Campground Not Found',404));
    res.render('campgrounds/details',{campground})
}));

router.get('/:id/edit', catchAsync(async (req,res) => {
    const {id} = req.params;
    //if(!ObjectId.isValid(id)) return next(new ExpressError('Invalid Id',400));
    const editCampground = await Campground.findById(id);
    res.render('campgrounds/edit',{editCampground});
}));

router.put('/:id', validateCamp,catchAsync(async (req,res) => {
    const{id} = req.params;
    const editedCamp = await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true,new:true})
    res.redirect(`/campgrounds/${editedCamp._id}`);
}));

router.delete('/:id',catchAsync(async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id); 
    res.redirect('/campgrounds')
}));


module.exports = router;