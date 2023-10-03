const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken:mapBoxToken});
const {cloudinary} = require('../cloudinary');


const index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
};

const renderNewForm = (req,res) => {
    res.render('campgrounds/new');
};

const createCamp = async (req,res) => {
    const geoData = await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();

    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({url:f.path,filename:f.filename}));
    newCamp.author = req.user._id;
    await newCamp.save();
    console.log(newCamp)
    req.flash('success','Successfully created a campground!');
    res.redirect(`/campgrounds/${newCamp._id}`)
};

const details = async (req,res,next) => {
    const{id} = req.params;
    //if(!ObjectId.isValid(id)) return next(new ExpressError('Invalid Id',400));
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }}).populate('author');
    if(!campground) {
        req.flash('error',"Can't find that campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/details',{campground})
};

const renderEditForm = async (req,res) => {
    const {id} = req.params;
    const editCampground = await Campground.findById(id);
    if(!editCampground) {
        req.flash('error',"Can't edit that campground - not found");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{editCampground});
};

const updateCamp = async (req,res) => {
    const{id} = req.params;
    const editedCamp = await Campground.findByIdAndUpdate(id,{...req.body.campground},
        {runValidators:true,new:true});
    const images = req.files.map(f => ({url:f.path,filename:f.filename}));
    editedCamp.images.push(...images);
    
    if(req.body.deleteImages) {// in the founded camp remove from images where images in the req.body
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await editedCamp.updateOne({$pull: {images:{filename:{$in:req.body.deleteImages}}}});
    }
    const geoData = await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    editedCamp.geometry = geoData.body.features[0].geometry;
    editedCamp.save();
    req.flash('success','Successfully updated a campground!');
    res.redirect(`/campgrounds/${editedCamp._id}`);
};

const deleteCamp = async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id); 
    req.flash('success','Successfully deleted a campground!');
    res.redirect('/campgrounds')
}

module.exports = {index,renderNewForm,createCamp,details,renderEditForm,updateCamp,deleteCamp};