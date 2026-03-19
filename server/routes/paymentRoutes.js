const express = require("express");
const { processDummyPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/pay", protect, processDummyPayment);

module.exports = router;