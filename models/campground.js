const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_200');
});

ImageSchema.virtual('media').get(function () {
    return this.url.replace('/upload', '/upload/w_300,h_300');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title:String,
    images: [ImageSchema],
    geometry:{
        type: {
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><h6><a href='/campgrounds/${this._id}'>${this.title}</a></h6></strong>
            <h4>${this.location.indexOf(',') !== -1 ?
                this.location.substring(0, this.location.indexOf(',')) : this.location}</h4>
            <h5 class='text-secondary'>$${this.price}<h5>
            `;
});

CampgroundSchema.post('findOneAndDelete', async (data) => {
    if (data)
        await Review.deleteMany({_id:{$in:data.reviews}});
});

module.exports = mongoose.model('Campground',CampgroundSchema);