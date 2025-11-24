const express = require("express");
const router = express.Router();

const artistaController = require("../controllers/artistaController");

router.post("/", function (req, res) {
    artistaController.cadastrar(req, res);
});

module.exports = router;
