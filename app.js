const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 1080;
const host = "localhost";

const router = require("./router/index");
const dburl = "mongodb+srv://zomato-users123:raman123@cluster0.vxh0v.mongodb.net/zomato?retryWrites=true&w=majority";
// const dburl = "mongodb://127.0.0.1:27017/zomato";
app.use(cors());
app.options("*",cors());
app.use(express.json());

app.use("/",router);

mongoose.connect(dburl , {useNewUrlParser: true , useUnifiedTopology: true})
    .then(res=>{
        app.listen(port,host,()=>{
        console.log(`server is running on ${host}:${port}`)
    })
    })
    .catch(err=>{console.log(err)})