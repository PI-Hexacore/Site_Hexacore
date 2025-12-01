const express = require("express");
const router = express.Router();

const artistaController = require("../controllers/artistaController");

router.get("/", function (req, res) {
    artistaController.listar(req, res);
});

router.post("/", function (req, res) {
    artistaController.cadastrar(req, res);
});

router.put("/:id", function (req, res) {
    artistaController.atualizar(req, res);
});

router.delete("/:id", function (req, res) {
    artistaController.excluir(req, res);
});

module.exports = router;
