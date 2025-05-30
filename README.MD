# Jobster API

Jobster is a RESTful API for user authentication and job management built with **Node.js**, **Express**, **MongoDB**, and **JWT**. It provides endpoints for registering and logging in users, as well as managing job entries (create, read, update, delete) for authenticated users. A special **test user** has **read-only** access. API documentation is available via **Swagger UI**.

## 🔗 Live Demo

- **Demo**: [https://jobster-henna.vercel.app](https://jobster-henna.vercel.app)
- **API Base URL**: [https://jobster-henna.vercel.app/api/v1](https://jobster-henna.vercel.app/api/v1)
- **Swagger Docs**: [https://jobster-henna.vercel.app/api-docs](https://jobster-henna.vercel.app/api-docs)
- **Front-end code**: included in `/client` folder (was not coded by me and was provided as a starter code by John Smilga in his course)

## ✨ Features

- User registration and login with JWT authentication
- Full job CRUD for regular users
- **Read-only job access** for test user
- Swagger UI API documentation
- Environment-based config and error handling

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or later
- MongoDB instance (local or hosted via MongoDB Atlas)

### Installation

1. Clone the repo

```bash
git clone https://github.com/Youssef-Elnemaky/Jobster-API.git
cd Jobster-API
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root with the following:

```env
MONGO_URI=your_mongodb_connection_string
SALT_ROUNDS=12
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=30d
```

4. Start the app

```bash
npm start
```



## 🛠️ Endpoints Overview

### Auth Routes

| Method | Route           | Description               |
|--------|------------------|---------------------------|
| POST   | /auth/register   | Register a new user, return JWT       |
| POST   | /auth/login      | Login user, return JWT    |
| PATCH  | /auth/updateUser | Update user profile (❌ test user is not allowed) |

### Job Routes (JWT Required)

| Method | Route       | Description                                                          |
|--------|-------------|----------------------------------------------------------------------|
| GET    | /jobs       | Get all jobs (supports filtering, sorting, search, and pagination)   |
| POST   | /jobs       | Create a new job (❌ test user is not allowed)                        |
| GET    | /jobs/:id   | Get a single job                                                     |
| PATCH  | /jobs/:id   | Update a job (❌ test user is not allowed)                            |
| DELETE | /jobs/:id   | Delete a job (❌ test user is not allowed)                            |
| GET    | /jobs/stats | Get job statistics                                                   |


### 🔍 Query Parameters for `/jobs`

- `status` – Filter by job status (`pending`, `interview`, `declined`)
- `jobType` – Filter by job type (`full-time`, `part-time`, `remote`, `internship`)
- `search` – Text search by company or position
- `sort` – Sort results (`latest`, `oldest`, `a-z`, `z-a`)
- `page` – Page number for pagination
- `limit` – Number of jobs per page

## 📄 API Documentation

- Swagger UI: [https://jobster-henna.vercel.app/api-docs](https://jobster-henna.vercel.app/api-docs)
- YAML definition: `/docs/swagger.yaml`

## 📦 Deployment

- **Backend & Frontend** hosted on Vercel: [jobster-henna.vercel.app](https://jobster-henna.vercel.app)
