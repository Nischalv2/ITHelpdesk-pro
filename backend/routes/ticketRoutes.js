const express = require("express");
const Ticket = require("../models/Ticket");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tickets
// Only admin and technician can view tickets
router.get(
  "/",
  authenticate,
  authorize("admin", "technician"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find().sort({ createdAt: -1 });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Create ticket
// Any authenticated user can create a ticket
router.post(
  "/",
  authenticate,
  async (req, res) => {
    try {
      const ticket = new Ticket({
        ...req.body,
      });

      const savedTicket = await ticket.save();

      res.status(201).json(savedTicket);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
);

// Update ticket status
// Only admin and technician can change status
router.put(
  "/:id",
  authenticate,
  authorize("admin", "technician"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Open",
        "In Progress",
        "In Review",
        "Done",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid ticket status",
        });
      }

      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      res.json(ticket);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;