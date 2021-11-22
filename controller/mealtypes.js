const mealtypes = require("../modules/dbmealtypes");

exports.getmealtypes = (req,res)=>{
    mealtypes.find()
    .then(response=>{
        res.status(200).json({message:"mealtypes fetched successfully",mealtype:response});
    })
    .catch(err=>{
        res.status(500).json({error:err})
    })
}