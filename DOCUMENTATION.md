# Project Documentation

## Features Implemented

- User and role management
- Financial records CRUD operations
- Record filtering by date range, category, and type
- Dashboard summary APIs for totals and trends
- Role-based access control
- Input validation and structured error handling
- Database persistence with MongoDB

## Technical Decisions and Trade-offs

The technical decisions in this project were made to keep the system secure, maintainable, and practical for a full-stack finance dashboard. Express.js was used with a layered backend structure consisting of routes, controllers, services, models, and utilities so that responsibilities remain clearly separated and the codebase is easier to extend. MongoDB with Mongoose was chosen for data persistence because it works well for user and financial record documents and also supports aggregation pipelines needed for dashboard summaries such as totals, category breakdowns, and trends. JWT-based authentication was implemented to provide a stateless and simple login flow for the frontend, while role-based access control was enforced through middleware so that permissions are consistently checked on the server rather than relying on the client. Input validation and centralized error handling were added to improve reliability and ensure predictable API responses. Financial records use soft delete instead of permanent deletion so that important data is not lost accidentally, which is a useful trade-off for finance-related applications. Filtering, pagination, and dashboard calculations are handled on the backend to reduce unnecessary data transfer and keep business logic centralized. Overall, the implementation favors simplicity, clarity, and secure backend enforcement over more advanced but complex patterns such as refresh-token systems, policy engines, or precomputed analytics, making it well-suited for an academic project or a practical demo application.

## API Documentation

- Swagger UI: `http://localhost:5000/api/docs`
- OpenAPI specification: `http://localhost:5000/api/docs/openapi.yaml`
- Source specification file: `server/openapi.yaml`

After deployment, replace `http://localhost:5000` with the deployed backend base URL.

## Setup Prerequisites Required

- Node.js and npm must be installed.
- MongoDB must be installed locally or available through a remote connection string.
- Environment variables must be configured for both the server and client before running the app.
- Required server settings include `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`.
- Required client settings include `VITE_API_URL`.

## Known Limitations

- The project is currently configured primarily for local development and does not yet include a public production deployment.
- Authentication uses JWT access tokens, but does not yet include refresh tokens, password reset, or multi-factor authentication.
- User management supports create, list, view, and update operations, but does not currently include user deletion.
- The system does not yet include rate limiting, audit logs, or advanced monitoring features.
- Dashboard summaries are generated in real time, which is suitable for moderate datasets but may require optimization for larger-scale usage.

## Areas for Improvement

- Deploy the backend and frontend to cloud hosting for a publicly accessible live version.
- Expand automated testing to cover more API flows, edge cases, and frontend behavior.
- Add advanced reporting features such as exports, downloadable summaries, and richer analytics views.
- Improve access control with more fine-grained permission rules beyond role-based grouping.
- Strengthen production readiness with rate limiting, logging, token refresh, and recovery workflows.
