const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const checkLoginPaciente = require('../validaciones/authPaciente');



router.get("/dashboard_paciente", checkLoginPaciente, function(req,res){
    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'usuario': req.session,
        'link' : link,
    };
    res.render("dashboard_paciente/calendario", data);
    
});

router.get("/dashboard_paciente/calendario", checkLoginPaciente, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'usuario': req.session,
        'link' : link,
    };
    
    res.render("dashboard_paciente/calendario", data);
});

router.get("/dashboard_paciente/citas", checkLoginPaciente, async (req,res) => {
    // const citas = database.Historias('select * from historias');

    const data = {
        'usuario': req.session,
        'link' : link,
    };
    
    res.render("dashboard_paciente/citas", data);
});

router.get("/dashboard_paciente/historias", checkLoginPaciente, async (req,res) => {
    //TRAER HISTORIA DE LA BD
    const idusuario = req.session.idusu;
    const historia = 'SELECT * FROM pacientes WHERE idpacientes=?';
    conexion.query(historia, idusuario,async function(error,rows){
        if (error) 
            {
                console.log("TRIKA error en la consulta de verificación", error);
                return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
            }
        else if(rows < 1){
            window.alert('USUARIO AGREGADO ANTES DEL PROCEDURE');
            //MOSTAR INGRESO DE DATOS
        }
        else{
            const paciente = rows[0];
            const data = {
                'usuario': req.session,
                'link' : link,
                'paciente' : paciente
            };
            res.render("dashboard_paciente/historias", data)
        }
    })
});

router.post("/dashboard_paciente/historias", checkLoginPaciente, async (req,res) => {
    //ENVIAR HISTORIA A LA BD
    const data = {
        'usuario': req.session,
        'link' : link,
    };
    
    res.render("dashboard_paciente/calendario", data);
});


router.get("/dashboard_paciente/test", checkLoginPaciente, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas': 0,
        'titulo' : 'pagina de calendario'
    };
    
    res.render('dashboard_paciente/test', data);
});

router.post("/dashboard_paciente/test", checkLoginPaciente, (req,res) => {

    // console.log(req.body);

    const data = {
        'username': req.body.username,
    };
    
    res.json(data);
});


module.exports= router;