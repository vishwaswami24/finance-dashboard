# Finance Data Processing and Access Control

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

A full-stack finance dashboard project focused on financial record processing, role-based access control, and summary insights for operational decision-making.

Additional project write-up: [DOCUMENTATION.md](./DOCUMENTATION.md)

## Overview

This project demonstrates:

- role-based user management with `viewer`, `analyst`, and `admin`
- protected financial record creation, update, delete, and filtering
- dashboard summary APIs for totals, category breakdowns, recent activity, and trends
- backend validation, useful error responses, and guarded routes
- a polished admin-facing interface for managing records and permissions

## Features

### User and access management

- create and manage users
- assign role-based permissions
- toggle user status between `active` and `inactive`
- prevent unauthorized actions through backend route guards

### Financial records

- create income and expense records
- update and soft-delete records
- filter by type, category, date range, and search text
- view paginated record lists

### Dashboard insights

- total income
- total expenses
- net balance
- record count
- category-wise totals
- recent activity
- monthly trend summary

### Validation and security

- JWT-based authentication
- role-enforced API access
- input validation for auth, users, records, and filters
- structured `400`, `401`, `403`, `404`, and `409` responses

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JSON Web Tokens

## Project Structure

```text
finanace-dashboard/
|-- client/
|   |-- src/
|   |-- index.html
|   `-- package.json
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   |-- test/
|   `-- package.json
|-- .gitignore
|-- LICENSE
|-- package.json
`-- README.md
```

## Role Model

| Role | Access |
| --- | --- |
| Viewer | Can view dashboard summaries only |
| Analyst | Can view dashboard summaries and records |
| Admin | Can manage users and perform full record CRUD |

## API Summary

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`

Admin only.

### Records

- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/records`
- `PATCH /api/records/:id`
- `DELETE /api/records/:id`

Admin can write. Analyst and admin can read.

Supported query params:

- `type`
- `category`
- `startDate`
- `endDate`
- `search`
- `page`
- `limit`

### Dashboard

- `GET /api/dashboard`

Available to viewer, analyst, and admin.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create these files:

- `server/.env`
- `client/.env`

Use the examples already included in the project:

```env
# server/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance-dashboard
JWT_SECRET=change-me-before-production
CLIENT_URL=http://localhost:5173
SEED_ADMIN_NAME=System Admin
SEED_ADMIN_EMAIL=admin@financehub.local
SEED_ADMIN_PASSWORD=Admin@123
```

```env
# client/.env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the backend

```bash
npm --workspace server run dev
```

### 4. Run the frontend

```bash
npm --workspace client run dev
```

### 5. Open the API documentation

After the backend is running, the project serves Swagger UI at:

- `http://localhost:5000/api/docs`
- `http://localhost:5000/api/docs/openapi.yaml`

After deployment, replace `http://localhost:5000` with your deployed API base URL.

You can also import [`server/openapi.yaml`](./server/openapi.yaml) into Swagger Editor or SwaggerHub.

### 6. Run tests

```bash
npm --workspace server run test
```

## Default Admin Account

If the database is empty on first startup, the server seeds a default admin user:

- Email: `admin@financehub.local`
- Password: `Admin@123`

Change these before using the project beyond local development.

## Notes

- Record deletion is implemented as soft delete using `deletedAt` and `deletedBy`.
- The backend is the source of truth for access control.
- Existing routes and UI are built around operational finance workflows.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
