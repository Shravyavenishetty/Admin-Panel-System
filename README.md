# Admin Panel System

A full-stack admin panel application with authentication and user management.

## 🚀 Features

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT-based authentication with session management
- **Protected Routes**: Route protection on both frontend and backend
- **Responsive Design**: Modern, clean UI with Tailwind CSS

---

## 📁 Project Structure

```
Admin-Panel-System/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components (LoginForm, ProtectedRoute)
│   │   ├── pages/          # Page components (LoginPage, DashboardPage)
│   │   ├── services/       # API services (authService)
│   │   ├── utils/          # Utility functions (tokenManager)
│   │   └── layouts/        # Layout components
│   └── package.json
└── backend/                 # Express backend
    ├── src/
    │   ├── config/         # Configuration files (database)
    │   ├── models/         # MongoDB models (Admin)
    │   ├── controllers/    # Route controllers (authController)
    │   ├── routes/         # API routes (adminRoutes)
    │   ├── middleware/     # Express middleware (auth)
    │   ├── utils/          # Utility functions (jwt)
    └── scripts/        # Utility scripts (seedAdmin)
    └── package.json
```

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- npm or yarn

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account if you don't have one
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already done)
npm install

# Configure environment variables
# Edit backend/.env and replace the MONGODB_URI with your actual MongoDB Atlas connection string

# Seed the admin user
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🔑 Default Admin Credentials

- **Email**: `admin@admin.com`
- **Password**: `admin123`

> ⚠️ **Important**: Change these credentials in production!

---

## 📡 API Endpoints

### Public Endpoints

- `POST /api/admin/login` - Admin login

### Protected Endpoints (Require JWT token)

- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify JWT token
- `GET /api/admin/me` - Get current admin details

### Health Check

- `GET /health` - Server health check

---

## 🔐 Authentication Flow

1. User enters email and password on login page
2. Frontend sends credentials to `POST /api/admin/login`
3. Backend validates credentials and generates JWT token
4. Token is stored in localStorage on frontend
5. Frontend includes token in Authorization header for protected routes
6. Backend middleware verifies token before allowing access

---

## 🎨 Technology Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 📝 Environment Variables

### Backend (.env)

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
SESSION_SECRET=your_session_secret
```

---

## 🚧 Next Phase (Task 2)

The next phase will include:
- Staff management (CRUD)
- Delivery agent management (CRUD)
- Outlet management (CRUD)
- Order management with filters and status updates

---

## 📄 License

ISC

---

## 👨‍💻 Author

Admin Panel System