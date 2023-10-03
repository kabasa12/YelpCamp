const mongoose = require('mongoose');
const cities = require('./cities');
const israelCities = require('./israelCities');
const campImages = require('./images');
const {places,descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',() => {
    console.log('DataBase Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++  ){
        const rand = Math.floor(Math.random() * 430);
        const randImg = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 300) + 10;
        const camp = new Campground({
            author:'65168fb8914b247c9453cfa5',
            //location:`${cities[rand].city}, ${cities[rand].state}`,
            location:`${israelCities[rand].city}, Israel`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum facere, accusamus in necessitatibus autem amet eligendi, a blanditiis sapiente esse atque, ab corporis excepturi adipisci! Saepe nisi vero voluptas fuga.`,
            price,
            images:campImages[randImg].images,
            geometry:{
                type:'Point',
                coordinates:[israelCities[rand].longitude,israelCities[rand].latitude]
            }
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});