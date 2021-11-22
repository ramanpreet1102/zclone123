const restaurant = require("../modules/dbrestaurant");

exports.getrestaurantsbylocationid = (req,res)=>{
    const id = req.params.locId;
    restaurant.find({location_id : id})
    .then(response=>{
        res.status(200).json({message:`restaurant having location id ${id} fetched successfully`,filterRes:response});
    })
    .catch(err=>{
        res.status(500).json({error:err})
    })
}

exports.restaurantFilter = (req,res)=>{
    let {location ,cuisine ,mealtype ,lcost ,hcost ,sort ,page} = req.body;

    sort = sort ? sort : 1;
    page = page ? page : 1;

    const itemsperpage = 3;
    let filterobj = {};
    const startindex = page * itemsperpage - itemsperpage;
    const endindex = page * itemsperpage;

    location && (filterobj["location_id"] = location);
    cuisine && (filterobj["cuisine_id"] = { $in : cuisine});
    mealtype && (filterobj["mealtype_id"] = mealtype);
    lcost && hcost && (filterobj["min_price"] = { $lte : hcost , $gte : lcost } ) ;
    
    restaurant.find(filterobj).sort({min_price:sort})
    .then(response=>{
        let pageArr = [];
        for(var i=1; i <= Math.ceil(response.length/itemsperpage); i++)
        {
            pageArr.push(i);            
        }    
        const filteredRestaurant = response.slice(startindex,endindex);
        res.status(200).json({message:`restaurant fetched successfully`, restaurant:filteredRestaurant , pages: pageArr , totalrestaurants: response.length});    
    })
    .catch(err=>{
        res.status(500).json({error:err})
    })
}

exports.getRestaurantDetailsById = (req, res) => {
    const { resId } = req.params;

    restaurant.findById(resId)
        .then(response => {
            res.status(200).json({ message: "Restaurant Fetched Succesfully", restaurant: response })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })

}