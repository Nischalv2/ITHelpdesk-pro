const express = require("express");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// GET MY TICKETS
// Logged-in user can see only their own tickets
// =====================================================

router.get(
  "/my",
  authenticate,
  async (req, res) => {
    try {
      const tickets = await Ticket.find({
        createdBy: req.user.id,
      })
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "assignedTo",
          "name email role"
        )
        .sort({ createdAt: -1 });

      res.json(tickets);
    } catch (error) {
      console.error(
        "Get my tickets error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch your tickets",
      });
    }
  }
);

// =====================================================
// GET ALL TICKETS
// Admin and technicians only
// =====================================================

router.get(
  "/",
  authenticate,
  authorize("admin", "technician"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });

      res.json(tickets);
    } catch (error) {
      console.error("Get tickets error:", error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// =====================================================
// GET TECHNICIANS
// Admin only
// =====================================================

router.get(
  "/technicians",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const technicians = await User.find({
        role: "technician",
      }).select("_id name email role");

      res.json(technicians);
    } catch (error) {
      console.error(
        "Get technicians error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);
// =====================================================
// GET ASSIGNED TICKETS
// Technicians see only tickets assigned to themselves
// =====================================================

router.get(
  "/assigned",
  authenticate,
  authorize("technician"),
  async (req, res) => {
    try {
      const tickets = await Ticket.find({
        assignedTo: req.user.id,
      })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });

      res.json(tickets);
    } catch (error) {
      console.error(
        "Get assigned tickets error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);
// =====================================================
// CREATE TICKET
// Any authenticated user
// =====================================================

router.post(
  "/",
  authenticate,
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        priority,
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          message:
            "Title and description are required",
        });
      }

      const ticket = new Ticket({
        title,
        description,
        category,
        priority,
        createdBy: req.user.id,
      });

      const savedTicket = await ticket.save();

      const populatedTicket =
        await Ticket.findById(savedTicket._id)
          .populate(
            "createdBy",
            "name email role"
          )
          .populate(
            "assignedTo",
            "name email role"
          );

      res.status(201).json(populatedTicket);
    } catch (error) {
      console.error(
        "Create ticket error:",
        error
      );

      res.status(400).json({
        message: error.message,
      });
    }
  }
);

// =====================================================
// ASSIGN TECHNICIAN
// Admin only
// =====================================================

router.put(
  "/:id/assign",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { technicianId } = req.body;

      if (!technicianId) {
        return res.status(400).json({
          message: "Technician ID is required",
        });
      }

      const technician = await User.findOne({
        _id: technicianId,
        role: "technician",
      });

      if (!technician) {
        return res.status(404).json({
          message: "Technician not found",
        });
      }

      const ticket =
        await Ticket.findByIdAndUpdate(
          req.params.id,
          {
            assignedTo: technician._id,
          },
          {
            new: true,
          }
        )
          .populate(
            "createdBy",
            "name email role"
          )
          .populate(
            "assignedTo",
            "name email role"
          );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      res.json(ticket);
    } catch (error) {
      console.error(
        "Assign technician error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE TICKET STATUS
// Admin and technicians
// =====================================================

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

      const ticket =
        await Ticket.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        )
          .populate(
            "createdBy",
            "name email role"
          )
          .populate(
            "assignedTo",
            "name email role"
          );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      res.json(ticket);
    } catch (error) {
      console.error(
        "Update ticket error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;