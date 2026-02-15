# Eventful API - Capstone Project

Eventful is a comprehensive ticketing and event management platform. This RESTful API serves as the backend, handling user authentication, event creation, ticket purchasing via Paystack, QR code generation for ticket validation, automated email reminders, and analytics.

## 🚀 Technologies Used
* **Runtime:** Node.js
* **Framework:** Express.js (Structured with strict MVC/Service layers)
* **Language:** TypeScript
* **Database:** MongoDB (Mongoose)
* **Caching:** Redis (`ioredis`)
* **Payments:** Paystack API
* **Documentation:** Swagger / OpenAPI
* **Task Scheduling:** `node-cron`
* **Emails:** Nodemailer
* **Testing:** Jest & Supertest

## 📁 Project Structure
The application strictly follows a modular, N-Tier architecture:
* `src/config/`: Database and Redis connection setups.
* `src/controllers/`: Request handling and response formatting.
* `src/docs/`: Swagger OpenAPI configuration.
* `src/dtos/`: Data Transfer Objects (Joi validation schemas).
* `src/interfaces/`: TypeScript interfaces and custom Express types.
* `src/jobs/`: Background tasks (Cron jobs for reminders).
* `src/middlewares/`: Auth guards, error handling, rate limiting.
* `src/models/`: Mongoose schemas.
* `src/routes/`: Express route definitions.
* `src/services/`: Core business logic.
* `src/utils/`: Helper functions (Paystack, Nodemailer, Response formatting).

## 🛠️ Setup & Installation

**1. Prerequisites**
Ensure you have the following installed on your machine:
* Node.js (v18 or higher)
* MongoDB (Local instance or MongoDB Atlas URL)
* Redis (Local instance or Upstash URL)

**2. Clone and Install**
```bash
git clone <your-repo-url>
cd eventful-api
npm install