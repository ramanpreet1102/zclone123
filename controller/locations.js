const location = require("../modules/dblocation");

exports.getlocations = (req,res)=>{
    location.find()
    .then(response=>{
        res.status(200).json({message:"locations fetched successfully",locations:response});
    })
    .catch(err=>{
        res.status(500).json({error:err})
    })
}