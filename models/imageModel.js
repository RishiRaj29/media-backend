//import mongoose
const mongoose = require("mongoose");


//route handler
const imageSchema = new mongoose.Schema({
   image_url: {
      type: String,
      required: true
   },
   folder_path:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Folder',
      required:true
   }
});

//export
module.exports = mongoose.model("Image", imageSchema);