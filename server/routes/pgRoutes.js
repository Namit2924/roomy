const express = require("express");
const {
  createPg,
  getAllPgs,
  getPgById,
  getOwnerPgs,
  updatePg,
  deletePg,
} = require("../controllers/pgController");
const { protect, ownerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllPgs);
router.get("/owner/my-pgs", protect, ownerOnly, getOwnerPgs);
router.get("/:id", getPgById);

router.post("/", protect, ownerOnly, createPg);
router.put("/:id", protect, ownerOnly, updatePg);
router.delete("/:id", protect, ownerOnly, deletePg);

module.exports = router;