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
    const idusuario = req.session.pac;
    const historia = 'SELECT h.id, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, m.nombre AS nombre_medico, m.especialidad_id AS especialidad_id, h.fecha, h.diagnostico, h.tratamiento, h.observaciones FROM historial_medico h JOIN pacientes p ON h.paciente_id= p.id JOIN medicos m ON h.medico_id = m.id WHERE h.paciente_id = ?;';
    conexion.query(historia, idusuario, async function(error,rows){
        if (error) 
            {
                console.log("TRIKA error en la consulta de verificación", error);
                return res.status(500).send(error);
            }
        else if(rows < 1){
            console.log('ERROR')
            //MOSTAR INGRESO DE DATOS
        }
        else{
            const historial_medico = rows[0];
            const data = {
                'usuario': req.session,
                'link' : link,
                'paciente' : historial_medico
            };
            console.log(historial_medico)
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