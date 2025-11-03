var express = require("express");
var router = express.Router();

var enderecoController = require("../controllers/enderecoController");

router.post("/cadastrar", function (req, res) {
    enderecoController.cadastrar(req, res);
});

router.get("/buscar/:idUsuario", function (req, res) {
    enderecoController.buscarPorId(req, res);
});

router.put("/atualizar/:idUsuario", function (req, res) {
    enderecoController.atualizar(req, res);
});

module.exports = router;