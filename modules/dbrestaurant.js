const mongoose = require("mongoose");

const schema = mongoose.Schema;

const restaurantschema = new schema({
    location_id:{
        type:Number,
        required:true
    },
    mealtype_id:{
        type:Number,
        required:true
    },
    min_price:{
        type:Number,
        required:true
    },
    cuisine_id:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model("restaurants data",restaurantschema,"restaurant");