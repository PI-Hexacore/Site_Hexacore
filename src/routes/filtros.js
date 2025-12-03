const express = require("express");
const router = express.Router();

const filtroController = require("../controllers/filtroController");

router.get("/buscarPaises", function (req, res) {
    filtroController.listarPaises(req, res);
});

router.get("/buscarGeneros", function (req, res){
    filtroController.listarGeneros(req,res)
})

router.post("/criarFiltro", function (req, res) {
  filtroController.criar(req, res);
});

router.get("/listarFiltrosUsuario", filtroController.listarFiltrosUsuario);

router.delete("/deletarFiltro", filtroController.deletar);

router.put("/editarFiltro", filtroController.editar);

module.exports = router;
