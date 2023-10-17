//import mongoose
const mongoose = require("mongoose");

//designing the schema of the project 
const SiteNameSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },

    site_name:{
        type: String,
        required: true,
    },

    city:{
        type: Schema.Types.ObjectId, ref: 'City', required: true
    }
});

const SiteName = mongoose.model("SiteName", SiteNameSchema);
module.exports = SiteName;