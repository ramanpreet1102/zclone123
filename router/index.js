const express = require("express");

const route = express.Router();

const locationController = require("../controller/locations");
const mealtypesController = require("../controller/mealtypes");
const restaurantController = require("../controller/restaurant");
const menuItemsController = require("../controller/items");
const userController = require("../controller/users");
const paymentGatewayController = require("../controller/payment");

route.get("/locations",locationController.getlocations);//done
route.get("/mealtypes",mealtypesController.getmealtypes);//done

route.get("/restaurants/:locId",restaurantController.getrestaurantsbylocationid);//done in search box
route.post("/filter",restaurantController.restaurantFilter);//done
route.get("/restaurant/:resId", restaurantController.getRestaurantDetailsById);//done

route.get("/menuitems/:resId", menuItemsController.getMenuItemsByResId);//done
route.post("/usersignup", userController.userSignUp);
route.post("/login", userController.userLogin);

route.post("/payment" , paymentGatewayController.payment);//done
route.post("/callback" , paymentGatewayController.callback);//done

module.exports = route;