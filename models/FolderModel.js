//import mongoose
const mongoose = require("mongoose");


//route handler
const FolderSchema = new mongoose.Schema({
   state:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'State',
        required:true
    },
    city:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'City',
        required:true
    },
    date:{
        type:String,
        required:true
    },
    sitename:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SiteName',
        required:true  
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department',
        required:true  
    }
});

//export
module.exports = mongoose.model("Folder", FolderSchema);