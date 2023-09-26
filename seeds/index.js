const mongoose = require('mongoose');
const cities = require('./cities');
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
    for(let i = 0; i < 50; i++  ){
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 300) + 10;
        const camp = new Campground({
            location:`${cities[rand].city}, ${cities[rand].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/1134892',
            description:`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum facere, accusamus in necessitatibus autem amet eligendi, a blanditiis sapiente esse atque, ab corporis excepturi adipisci! Saepe nisi vero voluptas fuga.`,
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});