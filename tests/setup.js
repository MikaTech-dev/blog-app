const express = require('express')
const mongoose = require('mongoose')
const { router: mockAuthRouter } = require('./mock_files/auth')
const mockBlogRouter = require('./mock_files/blog')
const { findUserByToken } = require('./mock_files/db')

// Create test app
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mock auth middleware
app.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
        const user = findUserByToken(token)
        if (user) {
            req.user = user
            return next()
        }
    }
    // No token or invalid token
    req.user = null
    next()
})

// Mount mock routes
app.use('/auth', mockAuthRouter)
app.use('/', mockBlogRouter)

// Global setup and teardown
beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogging-api-test')
})

afterAll(async () => {
    // Close database connection
    await mongoose.connection.close()
    // Clear all timers
    jest.clearAllTimers()
})

// Export app for testing
module.exports = app 