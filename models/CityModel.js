//import mongoose
const mongoose = require("mongoose");

//designing the schema of the project 
const CitySchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId,
    },

    city_name:{
        type: String,
        required: true,
    },

    state:{
        type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true
    }
});

const City = mongoose.model("City", CitySchema);
module.exports = City;