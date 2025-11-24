const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/dashboard", function (req, res) {
    dashboardController.obterDashboard(req, res);
});

module.exports = router;
