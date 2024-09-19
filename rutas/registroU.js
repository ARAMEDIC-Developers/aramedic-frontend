const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");
router.get("/registroU",function(req,res){
    res.render("registro",{link});
});

router.post("/registroU",function(req,res){
    //validaciones entre la linea 14 y 20
    let nombres=req.body.nom;
    let apellidos=req.body.ape;
    let email=req.body.ema;
    let contrasena=req.body.contra;
    let DNI=req.body.dni;
    let genero=req.body.gender;
    let numero_telefonico = req.body.num;
    let fecha_nacimiento = req.body.naci;
    const idrolPaciente = 1;

    //VERIFICAR DATOS
    function validarNombres(nombres){
        const namePattern = /^[a-zA-Z\s-']+$/; //VERIFICA QUE SOLO SE INGRESEN LETRAS
        return namePattern.test(nombres);
    }
    function validarApellidos(apellidos){
        const lastNamePattern = /^[a-zA-Z\s-']+$/; //VERIFICA QUE SOLO SE INGRESEN LETRAS
        return lastNamePattern.test(apellidos);
    }
    function validarNumTelefonico(num_telefonico){
        const phonePattern = /^\d{9}$/;; //VERIFICA QUE LOS DATOS INGRESADOS SEAN NÚMEROS Y HAYAN 9 DÍGITOS
        return phonePattern.test(num_telefonico);
    }
    function validarDNI(dni){
        const dniPattern = /^\d{8}$/;; //VERIFICA QUE LOS DATOS INGRESADOS SEAN NÚMEROS Y HAYAN 8 DÍGITOS
        return dniPattern.test(dni);
    }
    const nombreCorrecto = validarNombres(nombres);
    const apellidoCorrecto = validarApellidos(apellidos);
    const numCorrecto = validarNumTelefonico(numero_telefonico);
    const dniCorrecto = validarDNI(DNI);

    if(!nombreCorrecto) { console.log ('Error! Los nombres no pueden tener números ni carácteres especiales')}
    else if(!apellidoCorrecto){ console.log('Error! Los apellidos no pueden tener números ni carácteres especiales')}
    else if(!numCorrecto){ console.log('Error! El número telefónico que ha ingresado es incorrecto') }
    else if(!dniCorrecto) { console.log('Error! El DNI que ha ingresado es incorrecto')}
    else{
        const insertar="INSERT INTO usuario (DNI,nombres,apellidos,num_telefonico,genero,correo,contrasena,fecha_nacimiento,idrol) VALUES ('"+DNI+"','"+nombres+"','"+apellidos+"','"+numero_telefonico+"','"+genero+"','"+email+"','"+contrasena+"','"+fecha_nacimiento+"','"+idrolPaciente+"')";
                conexion.query(insertar,function(error){
                    if (error) {
                        console.log("TRIKA error");
                        throw error;
                    } else {
                        console.log("TRIKA datos almacenados correctamente");
                        res.redirect(link+"login");
                    }
                });
    }});
module.exports=router