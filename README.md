# Blogging API

A secure blogging platform built with **Node.js, Express, MongoDB, and EJS**, featuring user authentication, blog management, and a simple frontend interface.

##  Features
-  JWT Authentication (signup/login)
-  Full Blog CRUD Operations
-  Reading time calculation (auto-calculated based on content length)
-  Draft/Published state control
-  Read count tracking (increases on each view)
-  Owner-only edit/delete access
-  EJS-powered frontend views with CSS styling
-  Comprehensive testing setup for core functionality

---

##  Wanna test it out yourself?

### 1. Clone the Repository
``` 
git clone https://github.com/your-username/blogging-api.git
cd blogging-api
```

### 2. Install Dependencies
``` 
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogging-api
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=1h
```

> **Security Tip**: Generate a strong secret key using:
> ``` 
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## Database Setup

### Option A: Local MongoDB
Ensure MongoDB is running locally:
``` 
mongod
```

### Option B: MongoDB Atlas (Recommended for Deployment)
Use cloud-hosted MongoDB:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/blogging-api?retryWrites=true&w=majority
```

---

##  Running the Application

### Development Mode
``` 
npm run dev
```

### Production Mode
``` 
npm start
```

The server will run at `http://localhost:${PORT}`

---

## API Endpoints

| Method | Route | Description | Access |
|-------|-------|-------------|--------|
| GET | `/` | Get all published blogs | Public |
| POST | `/auth/signup` | Register a new user | Public |
| POST | `/auth/login` | Login and get JWT token | Public |
| GET | `/dashboard` | User dashboard (EJS) | Authenticated Users |
| POST | `/blogs/create` | Create a new blog | Authenticated Users |
| PUT | `/blogs/:id/edit` | Update an existing blog | Blog owner Only |
| DELETE | `/blogs/:id` | Delete a blog | Blog owner Only |
| GET | `/blogs/:id` | View a specific blog | Public |

---

## Example Requests

### 1. User Authentication

**Signup**
``` 
POST http://localhost:5000/auth/signup
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
``` 
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Blog Management

**Create a Blog**
``` 
POST http://localhost:5000/blogs/create
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "My First Blog",
  "content": "This is the content of my first blog post."
}
```

**Get All Published Blogs**
```
GET http://localhost:5000/
```

**View Specific Blog**
```
GET http://localhost:5000/blogs/64a7b9e1f8d8e42c12345678
```

---

## Frontend Interface (EJS)

View the web interface at:

- `http://localhost:5000/auth/signup` – Registration page  
- `http://localhost:5000/auth/login` – Login page  
- `http://localhost:5000/dashboard` – User dashboard  
- `http://localhost:5000/blogs/create` – Create blog form  

After login, tokens are automatically stored in browser `localStorage`.

---

## Deployment

Personally deployed to **Pipeops** with MongoDB Atlas, but you can use other PAAS and MongoDB cloud providers and it (probably) won't break lol

### Environment Variables in Production
Set these variables in your PaaS dashboard:
- `MONGODB_URI` – Your MongoDB connection string
- `JWT_SECRET` – Secure JWT signing key
- `PORT` – Port number (optional as it defaults to 5000)
