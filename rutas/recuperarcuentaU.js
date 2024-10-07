const express = require("express");
const router= express.Router();
const conexion=require("../config/conexion");
const link= require("../config/link");

//MOSTRAR FORMULARIO DE RECUPERAR CUENTA
router.get("/recuperarcuentaU", function(req, res) {
    res.render("verificarcorreo", { 
        link,
        errors: [], 
        oldData: {} 
    });
});
/*/
router.get("/recuperarcuentaU", function(req, res){
    res.render("recuperarcuenta", { 
        link,
        errors: [], 
        oldData: {} 
    });
});
/*/

router.post("/recuperarcuentaU", function(req, res){
    const ema = req.body.email;
    const validar="SELECT * FROM usuario WHERE correo = ?";
    conexion.query(validar,[ema],async function(error,rows){
        if (error) {
            console.log("TRIKA error en la consulta de verificación", error);
            return res.status(500).send("TRIKA ERROR EN EL SERVIDOR");
        }
        if (rows.length<1) {
            const mensajesError = [];
            mensajesError.push({ msg: "Error, Email no encontrado" });
            return res.render("recuperarcuenta", {
                link,
                errors: mensajesError,
                oldData: req.body
            });
        }
        else{
            res.render("correoenviado"), {
                link,
                oldData: {}
            }
        }
    })
})
module.exports = router;