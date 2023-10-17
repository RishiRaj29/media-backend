//import mongoose
const mongoose = require("mongoose");


//route handler
const imageSchema = new mongoose.Schema({
   type: String,
   required: true,
});

//export
module.exports = mongoose.model("Like", imageSchema);