const express = require("express");
const router = express.Router();

const musicaController = require("../controllers/musicaController");

router.get("/", function (req, res) {
    musicaController.listarPorPais(req, res);
});

module.exports = router;
