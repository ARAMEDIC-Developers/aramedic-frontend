const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");

router.get("/dashboard_jmedico",function(req,res){
    res.render("dashboard_jmedico",{link});
});

module.exports= router;