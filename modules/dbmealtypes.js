const mongoose = require("mongoose");

const schema = mongoose.Schema;

const mealtypes = new schema({
    meal_type:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("mealtype data",mealtypes,"mealtypes");