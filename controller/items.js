const items = require("../modules/dbitems");

exports.getMenuItemsByResId = (req, res) => {
    const { resId } = req.params;
    items.find({ restaurantId: resId })
        .then(response => {
            res.status(200).json({ message: "menuitems fetched succesfully", item: response })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}