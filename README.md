# Supermarket POS System

A comprehensive Point of Sale (POS) system built with **React** (Frontend) and **Node.js/Express** (Backend). The system utilizes **Prisma** as an ORM and **PostgreSQL** for robust data management.

## 🚀 Features

- **Authentication**: Secure login and registration with JWT (Role-based: ADMIN, STAFF).
- **Inventory Management**: Full CRUD operations for products with barcode support.
- **POS Billing**: Real-time cart management, barcode scanning, and receipt generation.
- **Sales Analytics**: Dashboard for both Admins and Staff to track revenue and transactions.
- **Inventory Alerts**: Automatic "Low Stock" and "Out of Stock" indicators.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL with Prisma ORM.
- **Auth**: JWT (JSON Web Tokens), Bcrypt.js.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js installed.
- PostgreSQL server running.

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` folder.
   - Add your PostgreSQL connection string:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/pos_db?schema=public"
     JWT_SECRET="your_secret_key"
     PORT=5000
     ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📖 API Documentation

The absolute base URL for all requests is: `http://localhost:5000/api`

### Auth Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login & receive JWT token |
| GET | `/auth/profile` | Authenticated | Get current user's profile |

### Product Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/products` | Authenticated | Get all products |
| GET | `/products/barcode/:barcode` | Authenticated | Get product by barcode |
| POST | `/products` | Admin Only | Create new product |
| PUT | `/products/:id` | Admin Only | Update product |
| DELETE | `/products/:id` | Admin Only | Delete product |

### Sales Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/sales` | Staff Only | Create a transaction |
| GET | `/sales/today` | Staff Only | View personal daily sales |
| GET | `/sales` | Admin Only | View full sales history |

---

## 🤝 Contributing
Contributions are welcome! Feel free to open a PR or an issue.

## 📜 License
This project is licensed under the ISC License.
