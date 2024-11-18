const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
const checkLoginPaciente = require('../validaciones/authPaciente');

router.get("/dashboard_paciente", function(req,res){
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

router.get("/dashboard_paciente/solicitar_consulta", checkLoginPaciente, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'usuario': req.session,
        'link' : link,
    };
    
    res.render("dashboard_paciente/solicitar_consulta", data);
});


router.get("/dashboard_paciente/citas", checkLoginPaciente, async (req,res) => {
    // const citas = database.Historias('select * from historias');
    const data = {
        'usuario': req.session,
        'link' : link,
    };
    res.render("dashboard_paciente/citas", data);
});

router.get("/dashboard_paciente/historia_clinica", checkLoginPaciente, async (req,res) => {
    //TRAER HISTORIA DE LA BD
    const idusuario = req.session.paciente_id;
    const historia = `
        SELECT p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.fecha_nacimiento, p.telefono,
               p.email, p.direccion, p.genero, p.estado_civil, p.ocupacion, h.motivo, h.enfermedades_previas, 
               h.alergias, h.medicamentos_actuales, h.cirugias_previas, h.fuma, h.consume_alcohol, 
               h.enfermedades_hereditarias, h.peso, h.altura, h.imc, h.descripcion_fisica,
               h.cirugia, h.procedimiento, h.riesgos, h.cuidado_preoperativo, h.cuidado_postoperativo
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id
        WHERE h.paciente_id = ?;
    `;
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
                'historia' : historial_medico
            };
            res.render("dashboard_paciente/historia_clinica", data)
        }
    })
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