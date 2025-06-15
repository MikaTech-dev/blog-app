const request = require('supertest');
const app = require('./setup');
const db = require('./mock_files/db');
const users = db.users;
const resetBlogs = db.resetBlogs;

// Test data
const testBlog = {
    title: 'Test Blog',
    content: 'This is a test blog content',
    state: 'published'
};

describe('Blog Endpoints', () => {
    const validToken = users[0].token; // Token for first user
    const otherUserToken = users[1].token; // Token for second user
    const invalidToken = 'invalid-token';

    // Reset blogs before each test
    beforeEach(() => {
        resetBlogs();
    });

    // Reset blogs after each test
    afterEach(() => {
        resetBlogs();
    });

    // GET /blogs - Get all published blogs
    describe('GET /blogs', () => {
        it('should return all published blogs', async () => {
            const res = await request(app)
                .get('/blogs')
                .expect(200);

            expect(res.body).toHaveLength(2);
            expect(res.body[0].title).toBe('Test Blog 1');
            expect(res.body[1].title).toBe('Test Blog 2');
        });

        it('should handle search query', async () => {
            const res = await request(app)
                .get('/blogs?search=Test Blog 1')
                .expect(200);

            expect(res.body).toHaveLength(1);
            expect(res.body[0].title).toBe('Test Blog 1');
        });
    });

    // GET /blogs/:id - Get single blog
    describe('GET /blogs/:id', () => {
        it('should return a single blog', async () => {
            const res = await request(app)
                .get('/blogs/mockBlogId1')
                .expect(200);

            expect(res.body.title).toBe('Test Blog 1');
            expect(res.body.content).toBe('Test content 1');
        });

        it('should return 404 for non-existent blog', async () => {
            await request(app)
                .get('/blogs/nonexistent')
                .expect(404);
        });
    });

    // POST /blogs - Create new blog
    describe('POST /blogs', () => {
        it('should create a new blog', async () => {
            const newBlog = {
                title: 'New Blog',
                content: 'New content'
            };

            const res = await request(app)
                .post('/blogs')
                .set('Authorization', `Bearer ${validToken}`)
                .send(newBlog)
                .expect(201);

            expect(res.body.title).toBe(newBlog.title);
            expect(res.body.content).toBe(newBlog.content);
        });

        it('should return 400 for missing required fields', async () => {
            await request(app)
                .post('/blogs')
                .set('Authorization', `Bearer ${validToken}`)
                .send({})
                .expect(400);
        });

        it('should return 401 for unauthorized access', async () => {
            await request(app)
                .post('/blogs')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send({ title: 'New Blog', content: 'New content' })
                .expect(401);
        });
    });

    // PUT /blogs/:id - Update blog
    describe('PUT /blogs/:id', () => {
        it('should update a blog', async () => {
            const update = {
                title: 'Updated Title'
            };

            const res = await request(app)
                .put('/blogs/mockBlogId1')
                .set('Authorization', `Bearer ${validToken}`)
                .send(update)
                .expect(200);

            expect(res.body.title).toBe(update.title);
        });

        it('should return 404 for non-existent blog', async () => {
            await request(app)
                .put('/blogs/nonexistent')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ title: 'Updated Title' })
                .expect(404);
        });

        it('should return 403 for unauthorized edit', async () => {
            await request(app)
                .put('/blogs/mockBlogId1')
                .set('Authorization', `Bearer ${otherUserToken}`)
                .send({ title: 'Updated Title' })
                .expect(403);
        });

        it('should return 401 for invalid token', async () => {
            await request(app)
                .put('/blogs/mockBlogId1')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send({ title: 'Updated Title' })
                .expect(401);
        });
    });

    // DELETE /blogs/:id - Delete blog
    describe('DELETE /blogs/:id', () => {
        it('should delete a blog', async () => {
            await request(app)
                .delete('/blogs/mockBlogId1')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(200);
        });

        it('should return 404 for non-existent blog', async () => {
            await request(app)
                .delete('/blogs/nonexistent')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(404);
        });

        it('should return 403 for unauthorized delete', async () => {
            // First verify the blog exists and belongs to first user
            const blog = db.blogs.find(b => b._id === 'mockBlogId1');
            expect(blog).toBeDefined();
            expect(blog.author).toBe(users[0]._id);

            // Try to delete with second user's token
            await request(app)
                .delete('/blogs/mockBlogId1')
                .set('Authorization', `Bearer ${otherUserToken}`)
                .expect(403);
        });

        it('should return 401 for invalid token', async () => {
            await request(app)
                .delete('/blogs/mockBlogId1')
                .set('Authorization', `Bearer ${invalidToken}`)
                .expect(401);
        });
    });

    // GET /dashboard - Get user dashboard
    describe('GET /dashboard', () => {
        it('should return user blogs', async () => {
            const res = await request(app)
                .get('/dashboard')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(200);

            // Get the first user's blogs from our mock data
            const expectedBlogs = db.blogs.filter(blog => blog.author === users[0]._id);
            expect(res.body).toHaveLength(expectedBlogs.length);
            expect(res.body[0].title).toBe(expectedBlogs[0].title);
        });

        it('should return 401 for invalid token', async () => {
            await request(app)
                .get('/dashboard')
                .set('Authorization', `Bearer ${invalidToken}`)
                .expect(401);
        });
    });
});
