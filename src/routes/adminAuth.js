const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { protect } = require("../middlewares/auth");

const adminAuth = express.Router();

//Admin-login Api
adminAuth.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. find admin in DB
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // 2. compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3. success - generate JWT
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set httpOnly cookie for 1 day
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});
// Protected demo route
adminAuth.get("/admin/profile", protect, (req, res) => {
  res.json({
    message: "Admin profile accessed successfully",
    admin: req.admin,
  });
});

// Admin logout - clear cookie
adminAuth.post("/admin/logout", protect, (req, res) => {
  // Clear the adminToken cookie
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    message: "Admin logged out successfully",
  });
});

module.exports = adminAuth;
