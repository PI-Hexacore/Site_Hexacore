const express = require("express");
const router = express.Router();
const slackController = require("../controllers/slackController");

router.get("/", slackController.obterConfigSlack);

router.post("/init", slackController.inicializarSlackAtivo);

router.put("/configurar", slackController.configurarSlack);

module.exports = router;
