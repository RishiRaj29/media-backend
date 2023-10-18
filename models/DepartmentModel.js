//import mongoose
const mongoose = require("mongoose");


//route handler
const DepartmentSchema = new mongoose.Schema({
   department_name:{
    type:String,
    required:true
   }
});

//export
module.exports = mongoose.model("Department", DepartmentSchema);