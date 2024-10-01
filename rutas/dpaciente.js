const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");

router.get("/dashboard_paciente",function(req,res){
    res.render("dashboard_paciente/calendario",{link});
});

router.get("/dashboard_pac/calendario", async (req,res) => {
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


module.exports= router;