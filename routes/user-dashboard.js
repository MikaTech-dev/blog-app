const express = require ("express")
const Blog = require ("../models/blog")
const router = express.Router()
const authenticate = require("../middleware/user-auth")

// GET /dashboard - Renders the dashboard page with user's blogs
router.get('/dashboard', authenticate, async (req, res) => {
    try {
        // Find all blogs by the current user
        const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
        res.render('dashboard', { user: req.user, blogs: blogs });
    } catch (error) {
        res.status(500).render('error', { message: 'Error loading dashboard', error: error.message });
    }
});

module.exports = router