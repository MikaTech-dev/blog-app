const express = require("express");
const router = express.Router();
const methodOverride = require('method-override');

const authenticate = require("../middleware/user-auth")
const Blog = require("../models/blog")
const User = require("../models/user")

// Enable method override for PUT and DELETE requests
router.use(methodOverride('_method'));

// GET /dashboard - Renders the dashboard page with user's blogs
router.get('/', authenticate, async (req, res) => {
    try {
        // Find all blogs by the current user
        const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
        res.render('dashboard', { user: req.user, blogs: blogs });
    } catch (error) {
        res.status(500).render('error', { message: 'Error loading dashboard', error: error.message });
    }
});

// GET /blogs/create - Render create blog form
router.get('/blogs/create', authenticate, (req, res) => {
    res.render('create_blog');
});

// GET /blogs/:id/edit - Render edit blog form
router.get('/blogs/:id/edit', authenticate, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).render('error', { message: 'Blog not found' })
        }
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { message: 'Not authorized to edit this blog' })
        }
        // Render the edit form for a single blog using edit_blog.ejs
        res.render('edit_blog', { blog: blog })
    } catch (error) {
        res.status(500).render('error', { message: 'Error loading blog', error: error.message })
    }
});

// POST /blogs - Create new blog
router.post('/blogs', authenticate, async (req, res) => {
    try {
        const { title, content, state } = req.body
        // Validate required fields for a single blog
        if (!title || !content) {
            return res.status(400).render('create_blog', { 
                error: 'Title and Content are required',
                title: title,
                content: content
            })
        }
        // Validate state for a single blog
        if (state !== 'draft' && state !== 'published') {
            return res.status(400).render('create_blog', {
                error: 'Invalid blog state',
                title: title,
                content: content
            })
        }
        const newBlog = new Blog({
            title: title,
            content: content,
            author: req.user._id,
            state: state
        })
        await newBlog.save()
        res.redirect('/s')
    } catch (error) {
        res.status(500).render('create_blog', { 
            error: 'Error creating blog',
            title: req.body.title,
            content: req.body.content
        })
    }
});

// PUT /blogs/:id - Update blog
router.put('/blogs/:id', authenticate, async (req, res) => {
    try {
        const { title, content, state } = req.body
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).render('error', { message: 'Blog not found' })
        }
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).render('error', { message: 'Not authorized to edit this blog' })
        }
        // Validate state for a single blog
        if (state !== 'draft' && state !== 'published') {
            return res.status(400).render('single_blog', {
                blog: { ...req.body, _id: blog._id },
                error: 'Invalid blog state'
            })
        }
        blog.title = title
        blog.content = content
        blog.state = state
        await blog.save()
        res.redirect('/')
    } catch (error) {
        res.status(500).render('single_blog', { 
            blog: { ...req.body, _id: req.params.id },
            error: 'Error updating blog'
        })
    }
});

// DELETE /blogs/:id - Delete blog
router.delete('/blogs/:id', authenticate, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this blog' });
        }
        await blog.deleteOne();
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
});

// GET /blogs - Get all published blogs (public route)
router.get('/blogs', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;
        const filter = req.query.filter || 'all';

        // Build the query
        let query = { state: 'published' };
        
        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Add filtering
        if (filter === 'recent') {
            query.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }; // Last 7 days
        } else if (filter === 'popular') {
            query.readCount = { $gt: 0 };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Get total count for pagination
        const total = await Blog.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Get blogs with pagination, sorting, and populate author
        const blogs = await Blog.find(query)
            .populate('author', 'first_name last_name')
            .sort({ [sort]: order })
            .skip(skip)
            .limit(limit);

        // Get filter options for the UI
        const filterOptions = {
            all: 'All Posts',
            recent: 'Recent Posts (Last 7 days)',
            popular: 'Popular Posts'
        };

        // Get sort options for the UI
        const sortOptions = {
            createdAt: 'Date',
            readCount: 'Reads',
            readingTime: 'Read Time'
        };

        res.render('blogs', { 
            blogs,
            pagination: {
                page,
                limit,
                total,
                totalPages
            },
            search,
            sort,
            order,
            filter,
            filterOptions,
            sortOptions
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Error fetching blogs', error: error.message });
    }
});

// GET /blogs/:id - Get single blog (public route)
router.get('/blogs/:id', async (req, res) => {
    try {
        // Render a single blog using single_blog.ejs for clarity
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'first_name last_name')
        if (!blog) {
            return res.status(404).render('error', { message: 'Blog not found' })
        }
        blog.readCount += 1
        await blog.save()
        res.render('single_blog', { blog: blog })
    } catch (error) {
        res.status(500).render('error', { message: 'Error fetching blog', error: error.message })
    }
});

module.exports = router;