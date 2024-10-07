const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const checkLoginMedico = require('../validaciones/authMedico');

router.get("/dashboard_jmedico", checkLoginMedico, function(req,res){
    const data = {
        'link' : link,
    }

    res.render("dashboard_medico/calendario", data);
});

router.get("/dashboard_jmedico/historia_clinica", checkLoginMedico, function(req,res){

    const data = {
        'link' : link,
    }

    res.render("dashboard_medico/historia_clinica", data);
});

router.post("/dashboard_jmedico/historia_clinica", checkLoginMedico, function(req,res){

    const data = {
        'link' : link,
    }

    res.json({mensaje: 'guardado correcto'});
    // res.render("dashboard_medico/historia_clinica", data);
});

router.get("/dashboard_jmedico/calendario", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'link' : link,
    };
    
    res.render("dashboard_medico/calendario", data);
});


router.get("/dashboard_jmedico/test", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario'
    };
    
    res.render('dashboard_medico/test', data);
});

router.post("/dashboard_jmedico/test", checkLoginMedico, (req,res) => {

    // console.log(req.body);

    const data = {
        'username': req.body.username,
    };
    
    res.json(data);
});

router.get("/dashboard_jmedico/historias", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');
    const total_historias = 0;

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'historias' : total_historias,
    };
    
    res.render("dashboard_medico/historias", data);
});

router.get("/dashboard_jmedico/citas", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');
    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
    };
    
    res.render("dashboard_medico/citas", data);
});

router.get("/dashboard_jmedico/cuentas", checkLoginMedico, async (req,res) => {

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
    };
    
    res.render("dashboard_medico/cuentas", data);
});

router.get("/dashboard_jmedico/servicios", checkLoginMedico, async (req,res) => {

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
    };
    
    res.render("dashboard_medico/servicios", data);
});

module.exports = router;