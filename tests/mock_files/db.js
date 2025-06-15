// Mock database with predefined users
const users = [
    {
        _id: 'mockUserId123',
        email: 'test@example.com',
        password: 'hashedPassword123',
        token: 'valid-token-123'
    },
    {
        _id: 'mockUserId456',
        email: 'other@example.com',
        password: 'hashedPassword456',
        token: 'valid-token-456'
    }
]

// Mock blogs with author references
const initialBlogs = [
    {
        _id: 'mockBlogId1',
        title: 'Test Blog 1',
        content: 'Test content 1',
        author: 'mockUserId123',
        published: true
    },
    {
        _id: 'mockBlogId2',
        title: 'Test Blog 2',
        content: 'Test content 2',
        author: 'mockUserId456',
        published: true
    }
]

// Create a copy of blogs that can be modified during tests
let blogs = [...initialBlogs]

// Reset blogs to initial state
const resetBlogs = () => {
    blogs = [...initialBlogs]
}

// Add getter for blogs to ensure we always get the latest state
Object.defineProperty(module.exports, 'blogs', {
    get: () => blogs
})

module.exports = {
    users,
    blogs,
    resetBlogs,
    // Helper functions
    findUserByToken: (token) => users.find(user => user.token === token),
    findUserById: (id) => users.find(user => user._id === id),
    findBlogById: (id) => blogs.find(blog => blog._id === id),
    findBlogsByAuthor: (authorId) => blogs.filter(blog => blog.author === authorId)
} 