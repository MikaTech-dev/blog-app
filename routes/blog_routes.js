const express = require("express");
const router = express.Router();

const authenticate = require ("../middleware/user-auth")
const Blog = require ("../schema_models/blog")      // Apparently it's good convention to use PascalCase when importing models
const User = require ("../schema_models/user")


// GET request, Get all published blogs
router.get ("/blog", async (req, res) => {
    try {
        // Find blog by its state
        const blogs = await Blog.find({ state: "published" }).populate("author", "first_name last_name");
        // .populate() replaces the author field (which is an ObjectId referencing a User) with the actual user data
        res.json(blogs);
    } catch (error) {
        res.status(400).json({ message: "Error fetching blogs", error: error.message });
    }
})

// GET request, Get ONE blog
router.get ("/blog/:id", authenticate, async (req, res) => {
    const blogURLId = req.params.id
    try {
        const blog = await Blog.findById(blogURLId).populate("author", "first_name", "last_name");
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        } 
        // Increasing blog views
        blog.readCount += 1;
        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: "This blog could not be found or does not exist.", error: error.message });
    }
})

// POST request to create a new blog
router.post ("/blog", authenticate, async (req, res) => {
    try {
        const { title, content } = req.body

        if (!title || !content) {
            return res.status (400).json ({ message: "Title and Content are required" })
        }

        const newBlog = new Blog ({ 
            title: title,
            content: content,
            author: req.user._id
         })

         await newBlog.save()
         res.status(201).json(newBlog)
         
    } catch (error) {
         res.status(500).json({ message: "Error creating blog", error: error.message });
    }
})

// PATCH (UPDATE) request 

// PATCH (UPDATE) request to update a blog by ID
router.patch("/blog/:id", authenticate, async (req, res) => {
    const blogURLId = req.params.id
    try {
        // Define which fields are allowed to be updated
        const allowedUpdates = ['title', 'content', 'state'];
        const updates = Object.keys(req.body);
        const isValidUpdate = updates.every(update => allowedUpdates.includes(update));  // Check if all requested updates are allowed

        if (!isValidUpdate) {
            // If any field is not allowed, return an error
            return res.status(400).json({ message: 'Invalid update fields!' });
        }

        // Find the blog by its ID
        const blog = await Blog.findById(blogURLId);

        if (!blog) {
            // If the blog doesn't exist, return 404
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the current user is the author of the blog
        if (blog.author.toString() !== req.user._id.toString()) {
            // If not, return a forbidden error
            return res.status(403).json({ message: "You're not authorized to edit this blog" });
        }

        // Update the allowed fields with new values
        updates.forEach(update => blog[update] = req.body[update]);
        await blog.save();

        res.json(blog);

    } catch (error) {
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
})

// DELETE request, Deleting blog (only by said blog's owner)
router.delete('/blog/:id', authenticate, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        // If the blog does not exist, return 404
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the current user is the author of the blog
        if (blog.author.toString() !== req.user._id.toString()) {
            // If not, return a forbidden error
            return res.status(403).json({ message: 'Not authorized to delete this blog' });
        }

        // Remove the blog from the database
        await blog.deleteOne();

        // Respond with a success message
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
});


module.exports = router;