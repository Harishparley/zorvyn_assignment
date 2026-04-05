# Finance Data Processing and Access Control Backend

This is the backend service for a finance dashboard system, developed as part of the **Backend Developer Intern** assessment for Zorvyn. It provides robust API endpoints for user authentication, role-based access control, financial record management, and dashboard analytics.

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing

## ✨ Core Features

1. **User and Role Management:** Secure registration and login system with three distinct roles (`Admin`, `Analyst`, `Viewer`).
2. **Role-Based Access Control (RBAC):** Custom middleware strictly enforcing route access based on user roles.
3. **Financial Records Management:** Full CRUD operations for financial entries (income/expense).
4. **Dashboard Analytics:** High-performance aggregation pipelines computing total income, expenses, net balance, and category-wise breakdowns in a single database query.

## 🧠 Assumptions & Design Decisions

To keep the application focused on correctness and maintainability, the following assumptions were made:
* **Role Permissions:**
  * **Admin:** Full access. Can create, read, update, and delete financial records.
  * **Analyst:** Can read records and access the aggregated dashboard summary endpoints.
  * **Viewer:** Read-only access to standard records. Cannot access high-level dashboard summaries.
* **Data Isolation:** For this initial scope, all users access a global pool of company financial records, regulated by their roles, rather than individual personal accounts. 
* **User Status:** A default `isActive` flag is included in the User model to allow future soft-deletion or suspension of users without removing their historical data.

## 🛠️ Local Setup & Installation

**1. Clone the repository**
\`\`\`bash
git clone <your-github-repo-url>
cd zorvyn-backend
\`\`\`

**2. Install dependencies**
\`\`\`bash
npm install
\`\`\`

**3. Configure Environment Variables**
Create a `.env` file in the root directory and add the following:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
\`\`\`

**4. Start the development server**
\`\`\`bash
npm run dev
\`\`\`
The server will start on `http://localhost:5000`.

## 📚 API Documentation

### Authentication (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Authenticate user & get token |

### Financial Records (`/api/records`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/` | All Authenticated | Get all records (Supports `?type=` & `?category=` queries) |
| POST | `/` | Admin Only | Create a new financial record |
| PUT | `/:id` | Admin Only | Update an existing record |
| DELETE | `/:id` | Admin Only | Delete a record |

### Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/summary` | Admin, Analyst | Get aggregated totals, net balance, and category breakdowns |

## 📂 Project Structure

\`\`\`text
├── config/           # Database configuration
├── controllers/      # Route logic and database interactions
├── middleware/       # Custom middleware (auth, error handling)
├── models/           # Mongoose schemas
├── routes/           # Express route definitions
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
└── server.js         # Application entry point
\`\`\`

---
**Author:** Harish