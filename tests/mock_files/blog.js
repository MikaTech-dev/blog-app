const express = require('express')
const router = express.Router()
const { blogs, findBlogById, findBlogsByAuthor } = require('./db')

// GET /blogs - Get all published blogs
router.get('/blogs', (req, res) => {
    const search = req.query.search?.toLowerCase()
    let filteredBlogs = blogs.filter(blog => blog.published)

    if (search) {
        filteredBlogs = filteredBlogs.filter(blog => 
            blog.title.toLowerCase().includes(search) || 
            blog.content.toLowerCase().includes(search)
        )
    }

    res.json(filteredBlogs)
})

// GET /blogs/:id - Get single blog
router.get('/blogs/:id', (req, res) => {
    const blog = findBlogById(req.params.id)
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' })
    }
    res.json(blog)
})

// POST /blogs - Create new blog
router.post('/blogs', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { title, content } = req.body
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and Content are required' })
    }

    const newBlog = {
        _id: `mockBlogId${blogs.length + 1}`,
        title,
        content,
        author: req.user._id,
        published: true
    }

    blogs.push(newBlog)
    res.status(201).json(newBlog)
})

// PUT /blogs/:id - Update blog
router.put('/blogs/:id', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const blog = findBlogById(req.params.id)
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' })
    }

    if (blog.author !== req.user._id) {
        return res.status(403).json({ message: 'Not authorized to edit this blog' })
    }

    const { title, content } = req.body
    if (title) blog.title = title
    if (content) blog.content = content

    res.json(blog)
})

// DELETE /blogs/:id - Delete blog
router.delete('/blogs/:id', (req, res) => {
    console.log('DELETE request for blog:', req.params.id) // Debug log
    console.log('Current blogs:', blogs) // Debug log
    
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const blog = findBlogById(req.params.id)
    console.log('Found blog:', blog) // Debug log
    
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' })
    }

    // Check authorization before attempting to delete
    if (blog.author !== req.user._id) {
        return res.status(403).json({ message: 'Not authorized to delete this blog' })
    }

    const blogIndex = blogs.findIndex(b => b._id === req.params.id)
    blogs.splice(blogIndex, 1)
    res.json({ message: 'Blog deleted successfully' })
})

// GET /dashboard - Get user dashboard
router.get('/dashboard', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    // Return all blogs belonging to the user
    const userBlogs = blogs.filter(blog => blog.author === req.user._id)
    res.json(userBlogs)
})

module.exports = router 