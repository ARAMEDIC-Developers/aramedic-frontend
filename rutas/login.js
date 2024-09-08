const express = require("express");
const router= express.Router();
const link= require("../config/link");

router.get("/login",function(req,res){
    res.render("login",{link});
});

module.exports= router;