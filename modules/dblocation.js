const mongoose = require("mongoose");

const schema = mongoose.Schema;

const locationschema = new schema({
    location_id:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("locations data",locationschema,"locations");