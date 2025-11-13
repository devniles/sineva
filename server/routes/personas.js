const express = require("express");
const router = express.Router();
const Persona = require("../models/Persona");

// ✅ Get all personas
router.get("/", async (req, res) => {
  try {
    const data = await Persona.find().sort({ createdAt: -1 });
    res.json({ status: "ok", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ Add new persona
router.post("/", async (req, res) => {
  try {
    const persona = new Persona(req.body);
    await persona.save();
    res.json({ status: "ok", data: persona });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ Edit persona
router.put("/:id", async (req, res) => {
  try {
    const updated = await Persona.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: "ok", data: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ Delete persona
router.delete("/:id", async (req, res) => {
  try {
    await Persona.findByIdAndDelete(req.params.id);
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
