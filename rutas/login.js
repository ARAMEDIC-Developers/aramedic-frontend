const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");

router.get("/login",function(req,res){
    res.render("login",{link});
});

router.post("/login",function(req,res){
    const DNI= req.body.dni;
    const contrasena= req.body.contra;

    const validar="SELECT * FROM usuario WHERE dni = ?";
    conexion.query(validar,[DNI],async function(error,rows){
        let mensaje;
        if (error) {
            console.log("TRIKA error consulta validar",error);
            return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
        }
        if (rows.length<1) {
            mensaje="TRIKA el dni no existe";
            res.redirect(link,mensaje);
        }  else {
            console.log("TRIKA datos almacenados correctamente");
            res.redirect(link+"login");
        }
    });

})


module.exports= router;