//import mongoose
const mongoose = require("mongoose");

//designing the schema of the project 
const StateSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId,
    },

    state_name:{
        type: String,
        required: true,
    }
});


const State = mongoose.model("State", StateSchema);
module.exports = State;