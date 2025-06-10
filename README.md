# blog-api
blog api creation


You are required to build a blogging api. The general idea here is that the api has a general endpoint that shows a list of articles that have been created by different people, and anybody that calls this endpoint, should be able to read a blog created by them or other users.

Requirements

Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
A user should be able to sign up and sign in into the blog app
Use JWT as authentication strategy and expire the token after 1 hour
A blog can be in two states; draft and published
Logged in and not logged in users should be able to get a list of published blogs created
Logged in and not logged in users should be able to to get a published blog
Logged in users should be able to create a blog.
When a blog is created, it is in draft state
The owner of the blog should be able to update the state of the blog to published
 The owner of a blog should be able to edit the blog in draft or published state
 The owner of the blog should be able to delete the blog in draft or published state
The owner of the blog should be able to get a list of their blogs.
The endpoint should be paginated
It should be filterable by state
Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated,
default it to 20 blogs per page. 
It should also be searchable by author, title and tags.
It should also be orderable by read_count, reading_time and timestamp
When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
Come up with any algorithm for calculating the reading_time of the blog.
Write tests for all endpoints
Note:

The owner of the blog should be logged in to perform actions

Use the MVC pattern

Database

Use MongoDB
​Data Models

___

User

– email is required and should be unique

– first_name and last_name is required

– password

Blog/Article

– title is required and unique

– description

– author

– state

– read_count

– reading_time

– tags

– body is required

– timestamp

Submission

___

– Push your code to GitHub 

– Host it on PipeOps/Heroku

– Share the PipeOps/Heroku link and the GitHub link using the AltSchool of Engineering Tinyuka Second Semester Project Submission (Nodejs)


# Blogging API Specification
This README outlines the specifications and requirements for building a RESTful Blogging API. Use this document as a guide to implement a complete and functional API service.
## Project Objective
Build a blogging platform backend API where users can:
- Register and authenticate
- Create and manage blog posts (drafts and published)
- Read and search for blogs (even without being logged in)
- Track reading analytics
---
## Requirements
### Authentication
- Use JWT for authentication.
- Tokens must expire after 1 hour.
- Users must be authenticated to perform any blog creation, update, delete, or state-change actions.
---
## User Functionality
- Users must be able to:
  - Sign up (first_name, last_name, email, password)
  - Sign in (returns JWT token)
---
## Blog Functionality
- Blog States: draft or published
- Anyone (logged in or not) should be able to:
  - Fetch all published blogs (paginated, searchable, filterable)
  - Fetch a single published blog (with author details and read_count incremented)
- Authenticated users (only the owner of a blog) should be able to:
  - Create blogs (initial state is draft)
  - Edit blogs in any state
  - Change blog state from draft to published
  - Delete blogs in any state
  - View their own blogs (with filtering by state)
---
## Blog Model
Each blog/article must include:
| Field         | Type     | Description                                    |
|---------------|----------|------------------------------------------------|
| title         | String   | Required, must be unique                      |
| description   | String   | Optional                                      |
| author        | ObjectId | Refers to the User who owns the blog          |
| state         | String   | Either draft or published                 |
| read_count    | Number   | Increments on every published blog read       |
| reading_time  | Number   | Calculated based on body word count           |
| tags          | [String] | Optional                                      |
| body          | String   | Required                                      |
| timestamp     | Date     | Automatically generated at blog creation      |
---
## Reading Time Algorithm
You may use an average reading speed (e.g., 200 words per minute) to calculate reading time:

---
## API Endpoints
### Authentication
- POST /auth/signup — Register a new user
- POST /auth/login — Log in and get JWT token
### Blog Public Endpoints
- GET /blogs — Get a list of published blogs (paginated, default 20/page)
  - Filters: state
  - Search: author, title, tags
  - Ordering: read_count, reading_time, timestamp
- GET /blogs/:id — Get a single published blog by ID (increments read_count)
### Blog Authenticated Endpoints (Require JWT)
- POST /blogs — Create a new blog (defaults to draft)
- PATCH /blogs/:id — Update a blog (title, body, tags, etc.)
- PATCH /blogs/:id/state — Publish a draft blog
- DELETE /blogs/:id — Delete a blog
- GET /user/blogs — Get all blogs by the logged-in user (filterable by state)
---
## Database
Use MongoDB with the following models:
### User
- first_name: String (required)
- last_name: String (required)
- email: String (required, unique)
- password: String (hashed)
### Blog
- title: String (required, unique)
- description: String
- author: ObjectId (reference to User)
- state: String (draft or published)
- read_count: Number (default 0)
- reading_time: Number (auto-calculated)
- tags: [String]
- body: String (required)
- timestamp: Date (auto-generated)
---
## Architecture
- Use MVC pattern:
  - Models: Handle DB schema and logic
  - Controllers: Handle business logic
  - Routes: Handle HTTP request/response
  - Middleware: Handle authentication, validation, error handling
---
## Testing
- Write unit and integration tests for:
  - All authentication endpoints
  - All blog-related endpoints (CRUD, filters, search, etc.)
  - Access control (only owners can modify/delete)
  - Pagination, ordering, and search features
---
## Additional Notes
- All owner-specific blog actions must verify JWT and blog ownership.
- Make sure all data returned is properly sanitized and structured.
- Use status codes and proper error messages consistently.
---