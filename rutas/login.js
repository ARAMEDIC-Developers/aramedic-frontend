const express = require("express");
const router= express.Router();
const link= require("../config/link");

router.get("/login",function(req,res){
    res.render("login",{link});
});

router.get("/dashboard_jmedico",function(req,res){
    res.render("dashboard_jmedico",{link});
});

module.exports= router;