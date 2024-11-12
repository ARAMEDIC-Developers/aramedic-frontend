const express = require("express");
const router = express.Router();
const conexion = require("../config/conexion");
const link = require("../config/link");
const checkLoginMedico = require('../validaciones/authMedico');
const { validarServicio } = require('../validaciones/servicios');

router.get("/dashboard_jmedico", checkLoginMedico, function(req,res){
    const data = {
        'link' : link,
        'usuario': req.session
    }

    res.render("dashboard_medico/calendario", data);
});

router.get("/dashboard_jmedico/historias", checkLoginMedico, function(req,res){
    const idusuario = req.session.med;
    const historias =  `
    SELECT u.dni, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.telefono,
               p.email, h.id, h.motivo, h.cirugia, h.procedimiento
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id= p.id
        JOIN usuarios u ON u.paciente_id = p.id
        JOIN medicos m ON h.medico_id = m.id
        WHERE h.medico_id = ?;
    `;
    conexion.query(historias, idusuario, async function(error,rows){
        if (error) 
            {
                console.log("TRIKA error en la consulta de verificación", error);
                return res.status(500).send(error);
            }
        else{
            const historial_medico = rows;
            const data = {
                'usuario': req.session,
                'link' : link,
                'paciente' : historial_medico
            };
            console.log(historial_medico)
            res.render("dashboard_medico/historias", data);
        }
    })
});

router.get("/dashboard_jmedico/historia_clinica", checkLoginMedico, function(req,res){
    const idusuario = req.session.med;
    const historiaid = req.query.historiaId;

    if (!historiaid) {
        return res.status(400).send('ID de historia clínica no proporcionado.');
    }

    // Consulta SQL para obtener los detalles de la historia clínica
    const sql = `
        SELECT p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, 
               m.nombre AS nombre_medico, m.especialidad_id AS especialidad_id,
               h.fecha, h.diagnostico, h.descripcion, h.tratamiento, h.observaciones
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id
        JOIN medicos m ON h.medico_id = m.id
        WHERE h.id = ? AND h.medico_id = ?;
    `;
    conexion.query(sql, [historiaid, idusuario], function(error, rows) {
        if (error) {
            console.log("Error al obtener historia clínica", error);
            return res.status(500).send("Error al obtener la historia clínica.");
        }

        if (rows.length === 0) {
            return res.status(404).send("Historia clínica no encontrada.");
        }

        // Renderizar la vista de edición, pasando los datos de la historia clínica
        const historiaClinica = rows[0];
        const data = {
            'usuario': req.session,
            'link': link,
            'historia': historiaClinica
        };
    res.render("dashboard_medico/historia_clinica", data);
    });
});

router.get("/dashboard_jmedico/calendario", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/calendario", data);
});


router.get("/dashboard_jmedico/test", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de calendario',
        'usuario': req.session
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
/*/
router.get("/dashboard_jmedico/historias", checkLoginMedico, async (req,res) => {
    // traer citas de la base de datos
    // const citas = database.Citas('select * from citas');
    const total_historias = 0;

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'historias' : total_historias,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/historias", data);
});
/*/
router.get("/dashboard_jmedico/citas", checkLoginMedico, async (req,res) => {
    
    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/citas", data);
});

router.get("/dashboard_jmedico/cuentas", checkLoginMedico, async (req,res) => {

    const data = {
        'total_citas':0,
        'titulo' : 'pagina de citas',
        'link' : link,
        'usuario': req.session
    };
    
    res.render("dashboard_medico/cuentas", data);
});


router.get("/dashboard_jmedico/servicios", checkLoginMedico, async (req, res) => {
    try {
        const servicios = await conexion.query("SELECT idservicio, nombre_servicio, tipo_procedimiento, costo, tiempo_estimado, tiempo_recuperacion FROM servicios");
        const data = {
            'link': link,
            'usuario': req.session,
            'servicios': servicios
        };
        res.render("dashboard_medico/servicios", data);
    } catch (error) {
        console.error("Error al obtener servicios:", error);
        res.status(500).send("Error al obtener servicios");
    }
});

router.get("/dashboard_jmedico/servicios/buscar", checkLoginMedico, async (req, res) => {
    const { nombre } = req.query;
    
    try {
        let query = "SELECT idservicio, nombre_servicio, tipo_procedimiento, costo, tiempo_estimado, tiempo_recuperacion FROM servicios";
        
        if (nombre) {
            query += " WHERE nombre_servicio LIKE ?";
            const servicios = await conexion.query(query, [`${nombre}%`]);
            return res.json(servicios);
        } else {
            const servicios = await conexion.query(query);
            return res.json(servicios);
        }
    } catch (error) {
        console.error("Error al buscar servicios:", error);
        res.status(500).send("Error al buscar servicios");
    }
});

router.post("/dashboard_jmedico/servicios/guardar", checkLoginMedico, async (req, res) => {
    const { nombre, tipoProcedimiento, costo, tiempoEstimadoProcedimiento, tiempoEstimadoRecuperacion } = req.body;

    // Validar datos de entrada
    const validacion = validarServicio({ nombre_servicio: nombre, costo, tipo_procedimiento: tipoProcedimiento });
    if (!validacion.valido) {
        return res.status(400).json({ mensaje: validacion.mensaje });
    }

    try {
        // Revisar si el nombre del servicio ya existe
        const [servicioExistente] = await conexion.query("SELECT * FROM servicios WHERE nombre_servicio = ?", [nombre]);

        if (servicioExistente) {
            // Si existe, actualizar la fila
            await conexion.query(
                "UPDATE servicios SET tipo_procedimiento = ?, costo = ?, tiempo_estimado = ?, tiempo_recuperacion = ? WHERE nombre_servicio = ?",
                [tipoProcedimiento, costo, tiempoEstimadoProcedimiento, tiempoEstimadoRecuperacion, nombre]
            );
            return res.json({ mensaje: "Servicio actualizado exitosamente" });
        } else {
            // Si no existe, insertar una nueva fila
            await conexion.query(
                "INSERT INTO servicios (nombre_servicio, tipo_procedimiento, costo, tiempo_estimado, tiempo_recuperacion) VALUES (?, ?, ?, ?, ?)",
                [nombre, tipoProcedimiento, costo, tiempoEstimadoProcedimiento, tiempoEstimadoRecuperacion]
            );
            return res.json({ mensaje: "Servicio añadido exitosamente" });
        }
    } catch (error) {
        console.error("Error al guardar el servicio:", error);
        return res.status(500).json({ mensaje: "Error al guardar el servicio" });
    }
});

module.exports = router;