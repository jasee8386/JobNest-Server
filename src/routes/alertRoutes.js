const express = require("express");
const router = express.Router();
const { getUserAlerts, markAlertRead } = require("../controllers/alertController");
const  { protect }  = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getUserAlerts);
router.patch("/:id/read", markAlertRead);

module.exports = router;
