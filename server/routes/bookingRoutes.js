const express = require("express");
const {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  getOwnerAnalytics,
  getOwnerPendingCount,
} = require("../controllers/bookingController");

const { protect, ownerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.get("/owner", protect, ownerOnly, getOwnerBookings);
router.get("/owner/analytics", protect, ownerOnly, getOwnerAnalytics);
router.get("/owner/pending-count", protect, ownerOnly, getOwnerPendingCount);
router.put("/:id/status", protect, ownerOnly, updateBookingStatus);
module.exports = router;