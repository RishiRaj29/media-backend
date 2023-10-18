//import mongoose
const mongoose = require("mongoose");

//designing the schema of the project 
const StateSchema = new mongoose.Schema({

    state_name:{
        type: String,
        required: true,
    }
});


const State = mongoose.model("State", StateSchema);
module.exports = State;