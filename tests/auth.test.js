const request = require('supertest');
const app = require('./setup');

// Test user data
const testUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'password123'
};

describe('Authentication Endpoints', () => {
    describe('POST /signup', () => {
        it('should create a new user successfully', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({
                    ...testUser,
                    email: 'new@example.com' // Use a different email
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'new@example.com');
        });

        it('should not create user with existing email', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send(testUser);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'A user with this email already exists...');
        });

        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'All fields are required, you might be missing something...');
        });
    });

    describe('POST /login', () => {
        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.status).toBe(302); // Redirect to dashboard
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should not login with non-existent email', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Email and password are required, you might be missing something...');
        });
    });
});
