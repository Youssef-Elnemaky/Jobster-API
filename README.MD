# Jobio API

Jobio is a RESTful API for user authentication and job management built with **Node.js**, **Express**, **MongoDB**, and **JWT**. It includes endpoints for registering and logging in users and managing job entries (create, read, update, delete). API documentation is provided via **Swagger UI**.

## 🔗 Live Demo

- **Demo**: [https://jobio-seven.vercel.app](https://jobio-seven.vercel.app)
- **API Base URL**: [https://jobio-production.up.railway.app/api/v1](https://jobio-production.up.railway.app/api/v1)
- **Swagger Docs**: [https://jobio-production.up.railway.app/api-docs](https://jobio-production.up.railway.app/api-docs)
- **Front-end code**: [https://github.com/Youssef-Nemaky/Jobio](https://github.com/Youssef-Nemaky/Jobio)


## ✨ Features

* User registration and login
* JWT-based authentication
* Full CRUD for jobs (create, read, update, delete)
* Swagger UI API documentation
* Environment-based configuration
* Error handling and rate limiting

## 🚀 Getting Started

### Prerequisites

* Node.js v14 or later
* MongoDB instance (local or cloud e.g., MongoDB Atlas)

### Installation

1. Clone the repo

```bash
git clone https://github.com/your-username/jobio-api.git
cd jobio-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root with the following:

```env
MONGO_URI=your_mongodb_connection_string
SALT_ROUNDS=10
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=1d
```

### Environment Variables

* `MONGO_URI`: Connection string for your MongoDB database.
* `SALT_ROUNDS`: Number of salt rounds for hashing passwords with bcrypt.
* `JWT_SECRET`: Secret key used to sign and verify JWTs.
* `JWT_LIFETIME`: Expiration time for JWT tokens (e.g., `1d`, `7d`).

4. Run the app

```bash
npm start
```

### Development

```bash
npm run dev
```

## 🛠️ Endpoints Overview

### Auth Routes

| Method | Route          | Description         |
| ------ | -------------- | ------------------- |
| POST   | /auth/register | Register new user   |
| POST   | /auth/login    | Login user, get JWT |

### Job Routes (Requires JWT)

| Method | Route      | Description      |
| ------ | ---------- | ---------------- |
| GET    | /jobs      | Get all jobs     |
| POST   | /jobs      | Create a new job |
| GET    | /jobs/\:id | Get single job   |
| PATCH  | /jobs/\:id | Update a job     |
| DELETE | /jobs/\:id | Delete a job     |

## 🥪 API Documentation

Available at:
📄 [https://jobio-production.up.railway.app/api-docs](https://jobio-production.up.railway.app/api-docs)

* Uses Swagger UI (`swagger-ui-express`)
* Swagger YAML or JSON located at `/swagger.yaml` or `/swagger.json`

## 📦 Deployment

This API was deployed using [Railway](https://railway.app), a simple and free cloud platform for deploying Node.js apps.

Front-end is hosted on [vercel](https://jobio-seven.vercel.app/)