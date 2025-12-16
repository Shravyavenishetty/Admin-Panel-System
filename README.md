# Admin Panel System

A comprehensive full-stack café operations platform with advanced menu management, delivery pricing engine, and multi-role API support.

## 🚀 Features

### **Core System**
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Real-Time Updates**: WebSocket (Socket.IO) for live data sync
- **Authentication**: JWT-based with role-based access control
- **Image Management**: Cloudinary integration
- **Responsive Design**: Modern, premium UI with Tailwind CSS

### **Menu Management** (Task 3)
- Complete CRUD operations with image upload
- 30 predefined café categories
- Food type classification (veg/non-veg/vegan)
- Availability toggle system
- Real-time updates across all clients
- Advanced filtering & pagination
- Duplicate prevention with unique constraints

### **Delivery Pricing Engine** (Task 3)
- Distance-based pricing using Haversine formula
- GST calculation (configurable rate)
- Zone-based pricing modifiers
- Complete price breakdown (subtotal, distance, GST, zones)
- Price preview before order creation
- Multi-outlet support with location tracking

### **Multi-Role System** (Task 3)
- **Admin**: Full system access, all CRUD operations
- **Manager**: Limited access, viewing & updates only
- **User**: Public menu access, order creation
- Field-level data filtering by role
- Protected routes with authorization middleware

### **Order Management** (Task 2 & 3)
- Complete order lifecycle management
- Status tracking with timeline history
- Delivery agent assignment
- Real-time status updates
- Filter by status, date, outlet
- Pagination & search

### **Staff & Agent Management** (Task 2)
- Staff CRUD operations (Admin only)
- Delivery agent management
- Status tracking for agents
- Role-based access control

### **Outlet Management** (Task 2)
- Multi-outlet support
- Location-based services
- Public outlet listing endpoint
- Manager assignment

---

## 📁 Project Structure

```
Admin-Panel-System/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React contexts (SocketContext)
│   │   ├── pages/              # Page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── MenuPage.jsx    # Full menu management
│   │   │   ├── OrdersPage.jsx  # Order management
│   │   │   ├── StaffPage.jsx
│   │   │   ├── AgentsPage.jsx
│   │   │   └── OutletsPage.jsx
│   │   ├── services/           # API service layer
│   │   └── utils/              # Utility functions
│   └── package.json
│
└── backend/                     # Express backend
    ├── src/
    │   ├── config/             # Configuration
    │   │   ├── database.js
    │   │   ├── cloudinary.js
    │   │   └── socket.js       # WebSocket setup
    │   ├── models/             # MongoDB schemas
    │   │   ├── Admin.js        # Role-based admin model
    │   │   ├── Menu.js         # Menu items
    │   │   ├── Order.js        # Orders with pricing
    │   │   ├── Staff.js
    │   │   ├── DeliveryAgent.js
    │   │   ├── Outlet.js
    │   │   └── Zone.js         # Pricing zones
    │   ├── controllers/        # Business logic
    │   ├── routes/             # API routes
    │   ├── middleware/         # Express middleware
    │   │   ├── auth.js         # JWT verification
    │   │   └── authorize.js    # Role-based authorization
    │   ├── services/           # Business services
    │   │   └── pricingService.js
    │   ├── utils/              # Utilities
    │   │   ├── queryBuilder.js
    │   │   ├── responseTransformer.js
    │   │   └── distanceCalculator.js
    │   └── scripts/            # Setup scripts
    └── package.json
```

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account (for image uploads)
- npm or yarn

### 1. MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string from "Connect" → "Connect your application"

### 2. Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com)
2. Get credentials from Dashboard

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and fill in values:
cp .env.example .env

# Required env variables:
# - MONGODB_URI
# - JWT_SECRET
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET

# Seed admin user
npm run seed

# Migrate existing admin users (if upgrading)
node scripts/migrateAdminRoles.js

# Start backend server
npm run dev
```

Backend runs on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔑 Default Admin Credentials

- **Email**: `admin@admin.com`
- **Password**: `admin123`

> ⚠️ **Important**: Change these in production!

---

## 📡 API Endpoints

### Public Endpoints

```
POST   /api/admin/login                    # Admin login
GET    /api/menu                           # Public menu listing
GET    /api/menu/categories                # Menu categories
GET    /api/outlets                        # Available outlets
POST   /api/orders/calculate               # Price calculation
POST   /api/orders                         # Create order (auth required)
```

### Admin Endpoints (require JWT + role checks)

#### **Menu Management**
```
GET    /admin/menu                         # Admin/Manager
POST   /admin/menu                         # Admin/Manager
PUT    /admin/menu/:id                     # Admin/Manager
DELETE /admin/menu/:id                     # Admin only
PATCH  /admin/menu/:id/availability        # Admin/Manager
```

#### **Order Management**
```
GET    /admin/orders/admin/all             # Admin/Manager
GET    /api/orders/:id                     # Owner/Admin/Manager
GET    /api/orders/:id/timeline            # Order status history
PATCH  /admin/orders/:id/status            # Admin/Manager
PATCH  /admin/orders/:id/assign-agent      # Admin only
```

#### **Staff Management**
```
GET    /admin/staff                        # Admin only
POST   /admin/staff                        # Admin only
PUT    /admin/staff/:id                    # Admin only
DELETE /admin/staff/:id                    # Admin only
```

#### **Delivery Agents**
```
GET    /admin/agents                       # Admin/Manager
POST   /admin/agents                       # Admin only
PUT    /admin/agents/:id                   # Admin/Manager
DELETE /admin/agents/:id                   # Admin only
PATCH  /admin/agents/:id/status            # Admin/Manager
```

#### **Outlets**
```
GET    /admin/outlets                      # Admin/Manager
POST   /admin/outlets                      # Admin only
PUT    /admin/outlets/:id                  # Admin only
DELETE /admin/outlets/:id                  # Admin only
```

### Query Parameters (Supported on list endpoints)

```
?search=<term>              # Text search
&category=<value>           # Filter by category
&status=<value>             # Filter by status
&available=true|false       # Filter availability
&dateFrom=<ISO_date>        # Date range start
&dateTo=<ISO_date>          # Date range end
&sort=<field>|-<field>      # Sort ascending/descending
&page=<number>              # Page number
&limit=<number>             # Items per page
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. User logs in with email/password
2. Backend validates and generates JWT with role
3. Token stored in localStorage
4. Token sent in Authorization header
5. Middleware verifies token and extracts role
6. Authorization middleware checks role permissions

### Role Permissions

| Resource | Admin | Manager | User |
|----------|-------|---------|------|
| Menu (View) | ✅ All | ✅ All | ✅ Public only |
| Menu (Create/Edit) | ✅ | ✅ | ❌ |
| Menu (Delete) | ✅ | ❌ | ❌ |
| Orders (View All) | ✅ | ✅ | Own only |
| Orders (Update Status) | ✅ | ✅ | ❌ |
| Staff (All ops) | ✅ | ❌ | ❌ |
| Agents (View) | ✅ | ✅ | ❌ |
| Agents (Create/Delete) | ✅ | ❌ | ❌ |
| Outlets (View) | ✅ | ✅ | ✅ Public |
| Outlets (Modify) | ✅ | ❌ | ❌ |

---

## 🌐 Real-Time Features

### WebSocket Events

The system uses Socket.IO for real-time updates:

**Menu Events:**
- `menuItemCreated` - New item added
- `menuItemUpdated` - Item modified
- `menuItemDeleted` - Item removed
- `menuItemToggled` - Availability changed

**Order Events:**
- `orderCreated` - New order placed
- `orderUpdated` - Order modified
- `orderDeleted` - Order cancelled

**Staff/Agent Events:**
- `staffCreated/Updated/Deleted`
- `agentCreated/Updated/Deleted`

### Connection

WebSocket endpoint: `http://localhost:5000`
- Frontend auto-connects via `SocketContext`
- Persists across page navigation
- Auto-reconnects on disconnect

---

## 💰 Pricing Calculation

### Formula

```javascript
subtotal = Σ(item.price × quantity)
distanceFee = distanceKm × ratePerKm
zoneModifier = baseFee × zone.modifierValue
taxableAmount = subtotal + distanceFee + zoneModifier
gstAmount = taxableAmount × gstRate
finalPrice = taxableAmount + gstAmount
```

### Components

- **Distance Fee**: Haversine formula for outlet-to-customer distance
- **Zone Modifiers**: Location-based price adjustments
- **GST**: Configurable tax rate (default 5%)

---

## 🎨 Technology Stack

### Frontend
- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- Axios
- Socket.IO Client

### Backend
- Node.js 18+
- Express 4
- MongoDB + Mongoose
- Socket.IO
- JWT
- bcryptjs
- Cloudinary
- Multer

---

## 📝 Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Session
SESSION_SECRET=your_session_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Pricing Config
GST_RATE=0.05
RATE_PER_KM=15
```

---

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

---

## 📦 Task Completion Status

- ✅ **Task 1**: Authentication & Basic Structure
- ✅ **Task 2**: Staff, Agents, Outlets, Orders Management
- ✅ **Task 3**: Advanced Menu + Pricing Engine + Multi-Role APIs

**Current Status**: Production-ready with all core features implemented

---

## 🚀 Deployment

### Backend
1. Set environment variables in hosting platform
2. Ensure MongoDB Atlas allows connections
3. Deploy to Heroku/Railway/DigitalOcean

### Frontend
1. Update API URL in production
2. Build: `npm run build`
3. Deploy to Vercel/Netlify

---

## 📄 License

ISC

---

## 👨‍💻 Author

Admin Panel System - Café Operations Platform