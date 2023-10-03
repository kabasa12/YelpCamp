const express = require('express');
const router = express.Router();
const {isLoggedIn,isAuthor,validateCamp} = require('../middleware');
const campgroundControl = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage})

router.route('/')
    .get(catchAsync(campgroundControl.index))
    .post(isLoggedIn,upload.array('image'),validateCamp,catchAsync(campgroundControl.createCamp));

router.get('/new',isLoggedIn,campgroundControl.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundControl.details))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCamp,catchAsync(campgroundControl.updateCamp))
    .delete(isLoggedIn,isAuthor,catchAsync(campgroundControl.deleteCamp));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgroundControl.renderEditForm));



module.exports = router;