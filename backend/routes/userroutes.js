const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Create User
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users
router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
