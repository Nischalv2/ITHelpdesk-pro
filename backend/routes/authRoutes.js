const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// =====================================================
// REGISTER USER
// Public registration creates normal users only
// =====================================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// =====================================================
// CREATE TECHNICIAN
// Admin only
// =====================================================

router.post(
  "/technicians",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email and password are required",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters",
        });
      }

      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      const technician = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "technician",
      });

      res.status(201).json({
        message: "Technician created successfully",
        technician: {
          id: technician._id,
          name: technician.name,
          email: technician.email,
          role: technician.role,
        },
      });
    } catch (error) {
      console.error("Create technician error:", error);

      res.status(500).json({
        message: "Failed to create technician",
      });
    }
  }
);

// =====================================================
// GET ALL TECHNICIANS
// Admin only
// =====================================================

router.get(
  "/technicians",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const technicians = await User.find(
        { role: "technician" },
        "name email role"
      ).sort({ name: 1 });

      res.json(technicians);
    } catch (error) {
      console.error("Get technicians error:", error);

      res.status(500).json({
        message: "Failed to get technicians",
      });
    }
  }
);
module.exports = router;