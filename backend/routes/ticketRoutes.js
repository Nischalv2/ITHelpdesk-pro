const express = require("express");
const Ticket = require("../models/Ticket");

const router = express.Router();

// Test route
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create ticket
router.post("/", async (req, res) => {
  try {
    const ticket = new Ticket(req.body);

    const savedTicket = await ticket.save();

    res.status(201).json(savedTicket);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;