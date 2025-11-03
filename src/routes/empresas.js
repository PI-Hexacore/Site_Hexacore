var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/autenticar", function (req, res) {
    empresaController.autenticar(req, res);
});

router.post("/cadastrar", function (req, res) {
    empresaController.cadastrar(req, res);
});

router.put("/atualizar/:idUsuario", function (req, res) {
    empresaController.atualizar(req, res);
});

router.delete("/deletar/:idUsuario", function (req, res) {
    empresaController.deletar(req, res);
});

router.get("/contar", function (req, res) {
    empresaController.contar(req, res);
});

module.exports = router;