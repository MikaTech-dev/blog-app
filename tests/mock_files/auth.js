const express = require('express')
const router = express.Router()

// Mock user data
const mockUser = {
    _id: 'mockUserId123',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com'
}

// Mock authentication middleware
const mockAuth = (req, res, next) => {
    // Skip authentication for auth routes
    if (req.path.startsWith('/auth/')) {
        return next()
    }
    
    // Check for Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' })
    }

    // Add mock user to request
    req.user = mockUser
    next()
}

// Mock signup route
router.post('/signup', (req, res) => {
    const { first_name, last_name, email, password } = req.body

    // Validation
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required, you might be missing something...' })
    }

    // Check for duplicate email
    if (email === mockUser.email) {
        return res.status(400).json({ message: 'A user with this email already exists...' })
    }

    // Mock token
    const token = 'mockToken123'

    return res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
            id: mockUser._id,
            first_name,
            last_name,
            email
        }
    })
})

// Mock login route
router.post('/login', (req, res) => {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required, you might be missing something...' })
    }

    // Mock successful login
    if (email === mockUser.email && password === 'password123') {
        return res.status(302).redirect('/dashboard')
    }

    return res.status(400).json({ message: 'Invalid email or password' })
})

module.exports = {
    router,
    mockAuth
} 