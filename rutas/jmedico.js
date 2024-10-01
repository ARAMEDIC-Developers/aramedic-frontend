const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");

router.get("/dashboard_jmedico",function(req,res){

    const data = {
        'link' : link,
    }

    res.render("dashboard_medico/calendario", data);
});

router.get("/dashboard_jmedico/calendario", async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario'
    };
    
    res.render("dashboard_medico/calendario");
});


router.get("/dashboard_jmedico/test", async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario'
    };
    
    res.render('dashboard_medico/test', data);
});

router.post("/dashboard_jmedico/test", (req,res) => {

    // console.log(req.body);

    const data = {
        'username': req.body.username,
    };
    
    res.json(data);
});




router.get("/dashboard_jmedico/historias", async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas'
    };
    
    res.render("dashboard_medico/historias", data);
});

router.get("/dashboard_jmedico/citas", async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas'
    };
    
    res.render("dashboard_medico/citas", data);
});

router.get("/dashboard_jmedico/cuentas", async (req,res) => {

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas'
    };
    
    res.render("dashboard_medico/cuentas", data);
});

router.get("/dashboard_jmedico/servicios", async (req,res) => {

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas'
    };
    
    res.render("dashboard_medico/servicios", data);
});

module.exports= router;