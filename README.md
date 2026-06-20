# 🍕 Cake Craft API

### A Modern & Scalable RESTful Backend API

Built with **Node.js** , **Express.js** , **TypeScript** , **PostgreSQL** , and **Drizzle ORM**

---

# 📖 Overview

Cake Craft API is a RESTful backend application designed for an online food ordering platform. It follows a clean and scalable architecture using controllers, services, routes, and database layers.

The API provides authentication, pizza management, cart management, order processing, user management, and review functionality while maintaining security and performance.

---

# ✨ Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 🍕 Pizza CRUD Operations
- 🛒 Shopping Cart Management
- 📦 Order Management
- ⭐ Review & Rating System
- 👥 User Management
- ✅ Request Validation using Zod
- ⚡ Global Error Handling
- 📄 Pagination & Filtering
- 🗄️ PostgreSQL Database
- 🚀 Clean & Scalable Architecture

---

# 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- JWT Authentication
- Zod Validation
- bcrypt
- dotenv
- Docker

---

# 📁 Project Structure

```text
cake-craft-api/
│
├── dist/
├── drizzle/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── db/
│   ├── data/
│   ├── scripts/
│   ├── types/
│   ├── utils/
│   ├── zodSchema/
│   │
│   ├── app.ts
│   ├── database.ts
│   └── server.ts
│
├── docker-compose.yml
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🏗 Architecture

```text
Client
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Database
   │
   ▼
PostgreSQL
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/rdsemon/cake_craft_api.git
```

## Enter Project Directory

```bash
cd cake_craft_api
```

## Install Dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

# 🚀 Application

NODE_ENV=development
PORT=5000

# 🗄️ Local PostgreSQL

##### DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# ☁️ Neon PostgreSQL

DATABASE_URL=postgresql://username:password@ep-xxxxxxxx.region.aws.neon.tech/database_name?sslmode=require

# 🔐 JWT Configuration

SALT_ROUNDS=10
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# ☁️ Cloudinary Configuration

CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Optional

##### CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

---

# 🚀 Running the Project

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

---

# 📚 API Endpoints

## 🎂 Cake

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | `/api/v1/cake`     |
| GET    | `/api/v1/cake/:id` |
| POST   | `/api/v1/cake`     |
| PATCH  | `/api/v1/cake/:id` |
| DELETE | `/api/v1/cake/:id` |

---

## 🛒 Cart

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | `/api/v1/cart`     |
| POST   | `/api/v1/cart`     |
| PATCH  | `/api/v1/cart/:id` |
| DELETE | `/api/v1/cart/:id` |

---

## 🔐 Authentication

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/v1/auth/signUp` |
| POST   | `/api/v1/auth/login`  |

---

## 📦 Orders

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | `/api/v1/order`     |
| POST   | `/api/v1/order`     |
| PATCH  | `/api/v1/order/:id` |
| DELETE | `/api/v1/order/:id` |

---

## 👤 Users

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | `/api/v1/user`     |
| GET    | `/api/v1/user/:id` |
| PATCH  | `/api/v1/user/:id` |
| DELETE | `/api/v1/user/:id` |

---

## ⭐ Reviews

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | `/api/v1/review`     |
| POST   | `/api/v1/review`     |
| PATCH  | `/api/v1/review/:id` |
| DELETE | `/api/v1/review/:id` |

---

# 🔒 Authentication

Protected endpoints require a valid JWT access token.

Example:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 📜 Available Scripts

```bash
npm run dev      # Start development server

npm run build    # Build TypeScript project

npm start        # Run production server
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Md Emon**

GitHub: [https://github.com/rdsemon](https://github.com/rdsemon)

---

# 📄 License

This project is licensed under the **MIT License** .

---

## ⭐ If you found this project helpful, please consider giving it a Star!

Made with ❤️ using Node.js, Express.js & TypeScript
