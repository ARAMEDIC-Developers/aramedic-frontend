const express = require("express");
const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const router = express.Router();
const conexion = require("../config/conexion");
const link = require("../config/link");
const checkLoginMedico = require('../validaciones/authMedico');
const { validarServicio } = require('../validaciones/servicios');


router.get("/dashboard_jmedico", checkLoginMedico, function(req,res){

    const data = {
        'link' : link,
        'usuario': req.session,
    }

    res.render("dashboard_medico/gestion_calendario", data);
});

router.get("/dashboard_jmedico/events", async function(req,res){

    const result = await new Promise((resolve, reject)=>{
        conexion.query(`
        SELECT 
            p.nombre,
            p.apellido,
            s.nombre as consulta,
            c.fecha,
            c.hora
        FROM citas as c 
        INNER JOIN medicos as m on m.id = c.medico_id
        INNER JOIN pacientes as p on p.id = c.paciente_id
        INNER JOIN servicios as s on s.id = c.servicio_id`, [], function(error, rows){
            if(error){
                reject(false);
            }
            resolve(rows);
        });
    });

    if (!result){
        return res.json([]);
    }

    const events = result.map((item, index)=>{
        const title = item.nombre+" "+item.apellido + " - " +item.consulta;

        const [hours, minutes, seconds = 0] = item.hora.split(":").map(Number)

        const current = new Date(item.fecha)
        const start = new Date(current.getFullYear(), current.getMonth(), current.getDate(),hours,minutes, seconds);
        return {
            title,
            start,
            end: start
        }
    });

    res.json(events);
});

router.get("/dashboard_jmedico/historias", checkLoginMedico, function(req,res){
    const idusuario = req.session.medico_id;
    const buscar = req.query.buscar ?? "";
    const historias = `
        SELECT u.dni, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.telefono,
            p.email, h.id, h.motivo, h.cirugia, h.procedimiento
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id= p.id
        JOIN usuarios u ON u.id = p.usuario_id
        JOIN medicos m ON h.medico_id = m.id
        WHERE h.medico_id = ? AND (p.nombre like concat(?,'%') OR p.apellido like concat(?,'%') OR u.dni like concat(?,'%') OR p.email like concat(?,'%'));
    `;
    
    conexion.query(historias, [idusuario, buscar, buscar, buscar, buscar], async function(error,rows){
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
                'historias' : historial_medico
            };
            res.render("dashboard_medico/historias", data);
        }
    })
});

router.get("/dashboard_jmedico/historia_clinica", checkLoginMedico, function(req,res){
    const idusuario = req.session.medico_id;
    const historiaid = req.query.historiaId;
    if (!historiaid) {
        return res.status(400).send('ID de historia clínica no proporcionado.');
    }
    // Consulta SQL para obtener los detalles de la historia clínica
    const historia = `
        SELECT p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.fecha_nacimiento, p.telefono,
               p.email, p.direccion, p.genero, p.estado_civil, p.ocupacion, h.motivo, h.enfermedades_previas,
               h.id, h.alergias, h.medicamentos_actuales, h.cirugias_previas, h.fuma, h.consume_alcohol, 
               h.enfermedades_hereditarias, h.peso, h.altura, h.imc, h.descripcion_fisica,
               h.cirugia, h.procedimiento, h.riesgos, h.cuidado_preoperativo, h.cuidado_postoperativo
        FROM historial_medico h
        JOIN pacientes p ON h.paciente_id = p.id
        JOIN medicos m ON h.medico_id = m.id
        WHERE h.id = ? AND h.medico_id = ?;
    `;
    conexion.query(historia, [historiaid, idusuario], function(error, rows) {
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

// Eliminar historia de la tabla y la BD
router.delete('/dashboard_jmedico/historias/:id', checkLoginMedico, (req, res) => {
    const historiaId = req.params.id;
    const medicoId = req.session.medico_id;

    // Consulta SQL para eliminar la historia clínica
    const query = `
        DELETE FROM historial_medico
        WHERE id = ? AND medico_id = ?;
    `;

    conexion.query(query, [historiaId, medicoId], (error, result) => {
        if (error) {
            console.error("Error al eliminar historia clínica:", error);
            return res.status(500).json({ mensaje: "Error al eliminar la historia clínica." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Historia clínica no encontrada o no tienes permiso para eliminarla." });
        }

        res.status(200).json({ mensaje: "Historia clínica eliminada exitosamente." });
    });
});


router.post("/dashboard_jmedico/historia_clinica", checkLoginMedico, async(req, res) =>{
    const idusuario = req.session.medico_id;
    const historiaId = req.body.historiaId;
    if (!idusuario) {
        return res.status(400).send("El ID del médico no está definido.");
    }
    if (!historiaId) {
        return res.status(400).send("El ID del historial clínico no está definido.");
    }
    const { motivo, enfermedadesPrevias, alergias, medicamentosActuales, cirugiasPrevias, fuma,
        consumeAlcohol, enfermedadesHereditarias, peso, altura, imc, descripcionFisica, cirugia,
        procedimiento, riesgos, cuidadoPreoperativo, cuidadoPostoperativo } = req.body;
        
    const query = `
        UPDATE historial_medico
        SET motivo = ?, enfermedades_previas = ?, alergias = ?, medicamentos_actuales = ?,
            cirugias_previas = ?, fuma = ?, consume_alcohol = ?, enfermedades_hereditarias = ?,
            peso = ?, altura = ?, imc = ?, descripcion_fisica = ?, cirugia = ?, procedimiento = ?,
            riesgos = ?, cuidado_preoperativo = ?, cuidado_postoperativo = ?
        WHERE id = ? AND medico_id = ?;
    `;
    conexion.query(
        query, [motivo, enfermedadesPrevias, alergias, medicamentosActuales, cirugiasPrevias, fuma,
            consumeAlcohol, enfermedadesHereditarias, peso, altura, imc, descripcionFisica, cirugia,
            procedimiento, riesgos, cuidadoPreoperativo, cuidadoPostoperativo, historiaId, idusuario
        ],
        (error, results) => {
            if (error) {
                console.log("Error al actualizar la historia clínica:", error);
                return res.status(500).send("Error al actualizar la historia clínica.");
            }

            if (results.affectedRows === 0) {
                return res.status(404).send("No se encontró el historial clínico o no tienes permisos para editarlo.");
            }

            res.redirect("/dashboard_jmedico/historias");
        }
    );
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
router.get("/dashboard_jmedico/citas", checkLoginMedico, async (req, res) => {
    try {
        const citas = await conexion.query(`
            SELECT 
                c.id, 
                p.nombre AS nombre_paciente,
                p.apellido AS apellido_paciente,
                c.medico_id,
                c.servicio_id,
                c.fecha,
                c.hora,
                c.estado
            FROM citas c
            JOIN pacientes p ON c.paciente_id = p.id
            WHERE c.medico_id = ? 
            ORDER BY c.fecha, c.hora;
        `, [req.session.medico_id]);  // Se pasa el ID del médico para filtrar las citas

        res.render("dashboard_medico/citas", {
            'total_citas': citas.length,
            'titulo': 'Página de citas',
            'link': link,
            'usuario': req.session,
            'citas': citas
        });
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).send("Error al obtener citas");
    }
});

router.get("/dashboard_jmedico/cuentas", checkLoginMedico, async (req, res) => {
    try {
        const usuarios = await conexion.query(`
            SELECT 
                u.dni, 
                u.rol_id,
                COALESCE(p.nombre, m.nombre) AS nombre,
                COALESCE(p.apellido, m.apellido) AS apellido,
                COALESCE(p.email, m.email) AS email
            FROM usuarios u
            LEFT JOIN pacientes p ON u.dni = p.usuario_id
            LEFT JOIN medicos m ON u.dni = m.usuario_id
        `);

        const data = {
            'link': link,
            'usuario': req.session,
            'usuarios': usuarios
        };
        res.render("dashboard_medico/cuentas", data);
    } catch (error) {
        console.error("Error al obtener cuentas:", error);
        res.status(500).send("Error al obtener cuentas");
    }
});

router.get("/dashboard_jmedico/cuentas/buscar", checkLoginMedico, async (req, res) => {
    const { dni } = req.query;

    try {
        let query = `
            SELECT 
                u.dni, 
                u.rol_id,
                COALESCE(p.nombre, m.nombre) AS nombre,
                COALESCE(p.apellido, m.apellido) AS apellido,
                COALESCE(p.email, m.email) AS email
            FROM usuarios u
            LEFT JOIN pacientes p ON u.dni = p.usuario_id
            LEFT JOIN medicos m ON u.dni = m.usuario_id
        `;
        
        if (dni) {
            query += " WHERE u.dni LIKE ?";
            const usuarios = await conexion.query(query, [`${dni}%`]);
            return res.json(usuarios);
        } else {
            const usuarios = await conexion.query(query);
            return res.json(usuarios);
        }
    } catch (error) {
        console.error("Error al buscar cuentas:", error);
        res.status(500).send("Error al buscar cuentas");
    }
});

// Ruta para validar si el DNI ya existe
router.get("/dashboard_jmedico/cuentas/validar-dni", checkLoginMedico, async (req, res) => {
    const { dni } = req.query;

    try {
        const [usuarioExistente] = await conexion.query("SELECT * FROM usuarios WHERE dni = ?", [dni]);

        if (usuarioExistente) {
            return res.json({ existe: true });
        }

        return res.json({ existe: false });
    } catch (error) {
        console.error("Error al validar DNI:", error);
        res.status(500).send("Error al validar DNI");
    }
});

// Ruta para guardar usuario (paciente o trabajador)
router.post("/dashboard_jmedico/cuentas/guardar", checkLoginMedico, async (req, res) => {
    const { dni, nombre, apellido, email, rol, contrasena } = req.body;

    try {
        // Insertar en la tabla usuarios
        await conexion.query(
            "INSERT INTO usuarios (dni, rol_id, contrasena) VALUES (?, ?, ?)",
            [dni, rol, contrasena]
        );

        if (rol == 1) { // Si es paciente
            // Insertar en la tabla pacientes
            await conexion.query(
                "INSERT INTO pacientes (usuario_id, nombre, apellido, email) VALUES (?, ?, ?, ?)",
                [dni, nombre, apellido, email]
            );
        } else if (rol == 2 || rol == 3) { // Si es medico o trabajador
            // Insertar en la tabla medicos
            await conexion.query(
                "INSERT INTO medicos (usuario_id, nombre, apellido, email) VALUES (?, ?, ?, ?)",
                [dni, nombre, apellido, email]
            );
        }

        return res.json({ success: true, mensaje: "Usuario agregado exitosamente" });
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        return res.status(500).json({ success: false, mensaje: "Error al guardar usuario" });
    }
});



router.get("/dashboard_jmedico/servicios", checkLoginMedico, async (req, res) => {
    try {

        const medico_id = req.session.medico_id;
        const servicios = await conexion.query(`SELECT s.id, s.nombre, s.descripcion, s.costo, s.tiempo_duracion, s.tiempo_recuperacion  FROM medico_servicio m
                                                JOIN servicios s ON m.servicio_id=s.id WHERE m.medico_id = `+medico_id);
        const data = {
            link: link,
            usuario: req.session,
            servicios: servicios,
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
        let query = `
            SELECT id, nombre, descripcion, costo, tiempo_duracion, tiempo_recuperacion 
            FROM servicios
        `;

        if (nombre) {
            query += " WHERE nombre LIKE ?";
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
    const { nombre, descripcion, costo, tiempo_duracion, tiempo_recuperacion } = req.body;

    // Validar datos de entrada
    const validacion = validarServicio({ nombre, descripcion, costo, tiempo_duracion, tiempo_recuperacion });
    if (!validacion.valido) {
        return res.status(400).json({ mensaje: validacion.mensaje });
    }

    try {
        // Revisar si el nombre del servicio ya existe
        const [servicioExistente] = await conexion.query("SELECT * FROM servicios WHERE nombre = ?", [nombre]);

        if (servicioExistente) {
            // Si existe, actualizar la fila
            await conexion.query(
                `UPDATE servicios 
                 SET descripcion = ?, costo = ?, tiempo_duracion = ?, tiempo_recuperacion = ? 
                 WHERE nombre = ?`,
                [descripcion, costo, tiempo_duracion, tiempo_recuperacion, nombre]
            );
            return res.json({ mensaje: "Servicio actualizado exitosamente" });
        } else {
            // Si no existe, insertar una nueva fila
            await conexion.query(
                `INSERT INTO servicios (nombre, descripcion, costo, tiempo_duracion, tiempo_recuperacion) 
                 VALUES (?, ?, ?, ?, ?)`,
                [nombre, descripcion, costo, tiempo_duracion, tiempo_recuperacion]
            );
            return res.json({ mensaje: "Servicio añadido exitosamente" });
        }
    } catch (error) {
        console.error("Error al guardar el servicio:", error);
        return res.status(500).json({ mensaje: "Error al guardar el servicio" });
    }
});

router.delete("/dashboard_jmedico/servicios/eliminar", checkLoginMedico, async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ mensaje: "El nombre del servicio es requerido." });
    }

    try {
        // Buscar y eliminar el servicio
        const resultado = await conexion.query("DELETE FROM servicios WHERE nombre = ?", [nombre]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Servicio no encontrado." });
        }

        return res.json({ mensaje: "Servicio eliminado exitosamente." });
    } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        return res.status(500).json({ mensaje: "Error al eliminar el servicio." });
    }
});


module.exports = router;
