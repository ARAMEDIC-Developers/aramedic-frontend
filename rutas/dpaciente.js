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
        else if(rows > 1){
            console.log('Ingresar nuevos datos');
            //MOSTAR INGRESO DE DATOS
        }
        else{
            const paciente = rows[0];
            const edad = paciente.edad;
            const estado_civil = paciente.estado_civil;
            const ocupacion = paciente.ocupacion;
            const direccion = paciente.direccion;
            const motivo_principal = paciente.motivo_principal;
            const enfermedades_previas = paciente.enfermedades_previas;
            const alergia = paciente.alergia;
            const medicamentos_actuales = paciente.medicamentos_actuales;
            const cirugias_previas = paciente.cirugias_previas;
            const fuma = paciente.fuma;
            const consume_alcohol = paciente.consume_alcohol;
            const enfermedades_hereditarias = paciente.enfermedades_hereditarias;
            const peso = paciente.peso;
            const altura = paciente.peso;
            const indice = paciente.indice_de_masa_corporal_mic;
            const descripcion = paciente.descripcion_fisica;
            const cirigua = paciente.cirugia;
            const descripcion_procedimiento = paciente.descripcion_del_procedimiento;
            const riesgos = paciente.riesgos_y_complicaciones;
            const cuidado_pre = paciente.cuidado_preoperatorio;
            const cuidado_post = paciente.cuidado_postoperatorio;
            const data = {
                'usuario': req.session,
                'link' : link,
                'oldData' : oldData
            };
            //ENVIAR DATOS A LA VISTA (TO BE)
            console.log(paciente);
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