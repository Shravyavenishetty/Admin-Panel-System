# Complete API Endpoints Reference

**Base URL:** `http://localhost:5000`

---

## 🔐 Authentication

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/admin/login` | Admin/Manager login | ❌ No | Public |
| POST | `/api/admin/logout` | Logout | ✅ Yes | Any |
| GET | `/api/admin/verify` | Verify JWT token | ✅ Yes | Any |
| GET | `/api/admin/me` | Get current admin details | ✅ Yes | Any |

---

## 🍽️ Menu Management

### Public Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/menu` | Get all menu items (public) | ❌ No |
| GET | `/api/menu/categories` | Get menu categories | ❌ No |
| GET | `/api/menu/:id` | Get single menu item | ❌ No |

**Query Parameters for `/api/menu`:**
- `category` - Filter by category
- `available` - Filter by availability (true/false)
- `search` - Search in name, description, tags
- `foodType` - Filter by food type (veg/non-veg/vegan)
- `page` - Page number
- `limit` - Items per page
- `sort` - Sort field (e.g., price, -createdAt)

### Admin Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/menu` | Get all menu items (admin) | ✅ Yes | Admin, Manager |
| POST | `/admin/menu` | Create menu item | ✅ Yes | Admin, Manager |
| PUT | `/admin/menu/:id` | Update menu item | ✅ Yes | Admin, Manager |
| DELETE | `/admin/menu/:id` | Delete menu item | ✅ Yes | Admin Only |
| PATCH | `/admin/menu/:id/availability` | Toggle availability | ✅ Yes | Admin, Manager |

---

## 🏪 Outlets

### Public Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/outlets` | Get all public outlets | ❌ No |

### Admin Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/outlets` | Get all outlets (admin) | ✅ Yes | Admin, Manager |
| POST | `/admin/outlets` | Create outlet | ✅ Yes | Admin Only |
| PUT | `/admin/outlets/:id` | Update outlet | ✅ Yes | Admin Only |
| DELETE | `/admin/outlets/:id` | Delete outlet | ✅ Yes | Admin Only |

---

## 📦 Orders

### Public/Customer Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders/calculate` | Calculate order pricing | ❌ No |
| POST | `/api/orders` | Create order | ✅ Yes |
| GET | `/api/orders/:id` | Get order details | ✅ Yes |
| GET | `/api/orders/:id/timeline` | Get order status history | ✅ Yes |

**Request Body for `/api/orders/calculate` and `/api/orders`:**
```json
{
  "customerName": "John Doe",
  "customerPhone": "9876543210",
  "items": [
    {
      "menuItemId": "menu_item_id",
      "quantity": 2
    }
  ],
  "outletId": "outlet_id",
  "deliveryAddress": {
    "address": "123 Street Name",
    "lat": 12.9716,
    "lng": 77.5946
  }
}
```

### Admin Endpoints
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/orders/admin/all` | Get all orders | ✅ Yes | Admin, Manager |
| PATCH | `/admin/orders/:id/status` | Update order status | ✅ Yes | Admin, Manager |
| PATCH | `/admin/orders/:id/assign-agent` | Assign delivery agent | ✅ Yes | Admin Only |

**Query Parameters for `/admin/orders/admin/all`:**
- `status` - Filter by status (pending, confirmed, preparing, dispatched, delivered, cancelled)
- `search` - Search by customer name, phone, order number
- `page` - Page number
- `limit` - Items per page
- `sort` - Sort field

**Order Status Flow:**
```
pending → confirmed → preparing → dispatched → delivered
                     ↓
                 cancelled
```

---

## 👥 Staff Management

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/staff` | Get all staff | ✅ Yes | Admin Only |
| POST | `/admin/staff` | Create staff | ✅ Yes | Admin Only |
| PUT | `/admin/staff/:id` | Update staff | ✅ Yes | Admin Only |
| DELETE | `/admin/staff/:id` | Delete staff | ✅ Yes | Admin Only |

---

## 🏍️ Delivery Agents

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/agents` | Get all agents | ✅ Yes | Admin, Manager |
| POST | `/admin/agents` | Create agent | ✅ Yes | Admin Only |
| PUT | `/admin/agents/:id` | Update agent | ✅ Yes | Admin, Manager |
| PATCH | `/admin/agents/:id/status` | Update agent status | ✅ Yes | Admin, Manager |
| DELETE | `/admin/agents/:id` | Delete agent | ✅ Yes | Admin Only |

---

## 💰 Zone Pricing (Optional)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/zones` | Get all pricing zones | ✅ Yes | Admin Only |
| POST | `/admin/zones` | Create pricing zone | ✅ Yes | Admin Only |
| PUT | `/admin/zones/:id` | Update zone | ✅ Yes | Admin Only |
| DELETE | `/admin/zones/:id` | Delete zone | ✅ Yes | Admin Only |

---

## ⚙️ System Configuration (Optional)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/config` | Get system config | ✅ Yes | Admin Only |
| PUT | `/admin/config` | Update config | ✅ Yes | Admin Only |

---

## � Real-Time Notifications (WebSocket)

**WebSocket URL:** `ws://localhost:5000`

The system uses Socket.IO for real-time notifications. Connect to the WebSocket server to receive live updates.

### Manager/Admin Notifications

**Events Received:**
| Event Name | Description | Payload |
|------------|-------------|---------|
| `menuItemCreated` | New menu item added | `{ _id, name, price, category }` |
| `menuItemUpdated` | Menu item modified | `{ _id, name, price, availability }` |
| `menuItemDeleted` | Menu item removed | `{ id, name }` |
| `menuItemToggled` | Availability changed | `{ id, availability }` |
| `orderCreated` | New order placed | `{ _id, orderNumber, customerName, status }` |
| `orderUpdated` | Order modified | `{ _id, orderNumber, status }` |
| `orderStatusChanged` | Order status updated | `{ _id, orderNumber, status, changedBy }` |
| `staffCreated` | New staff added | `{ _id, name, role }` |
| `staffUpdated` | Staff modified | `{ _id, name, role }` |
| `staffDeleted` | Staff removed | `{ id, name }` |
| `agentCreated` | New agent added | `{ _id, name, status }` |
| `agentUpdated` | Agent modified | `{ _id, name, status }` |
| `agentDeleted` | Agent removed | `{ id, name }` |

### Customer Notifications

**Events Received:**
| Event Name | Description | Payload |
|------------|-------------|---------|
| `orderStatusChanged` | Your order status updated | `{ orderNumber, status, note }` |
| `orderAssigned` | Delivery agent assigned | `{ orderNumber, agentName, agentPhone }` |

### WebSocket Connection Example

**JavaScript:**
```javascript
const socket = io('http://localhost:5000');

// Manager listening to all events
socket.on('orderCreated', (order) => {
    console.log('New order:', order.orderNumber);
    // Update UI, show notification
});

socket.on('orderStatusChanged', (data) => {
    console.log('Order status changed:', data);
    // Refresh order list or update specific order
});

// Customer listening to their order updates
socket.on('orderStatusChanged', (data) => {
    if (data.orderNumber === myOrderNumber) {
        console.log('Your order is now:', data.status);
        // Show notification to customer
    }
});
```

**Frontend Integration:**
- Admin panel automatically connects on login
- Listens to all events for real-time UI updates
- No polling needed - instant updates

---

## �📊 Dashboard (Optional)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/admin/dashboard/stats` | Get dashboard statistics | ✅ Yes | Admin, Manager |

---

## 🔧 Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Server health check | ❌ No |

---

## 📋 Summary by Access Level

### **Public (No Auth)**
- GET `/api/menu`
- GET `/api/menu/categories`
- GET `/api/menu/:id`
- GET `/api/outlets`
- POST `/api/orders/calculate`
- GET `/health`

### **Authenticated Users**
- POST `/api/orders`
- GET `/api/orders/:id`
- GET `/api/orders/:id/timeline`
- POST `/api/admin/logout`
- GET `/api/admin/verify`
- GET `/api/admin/me`

### **Manager Access**
All authenticated endpoints plus:
- GET `/admin/menu`
- POST `/admin/menu`
- PUT `/admin/menu/:id`
- PATCH `/admin/menu/:id/availability`
- GET `/admin/outlets`
- GET `/admin/orders/admin/all`
- PATCH `/admin/orders/:id/status`
- GET `/admin/agents`
- PUT `/admin/agents/:id`
- PATCH `/admin/agents/:id/status`

### **Admin Only**
All of the above plus:
- DELETE `/admin/menu/:id`
- POST `/admin/outlets`
- PUT `/admin/outlets/:id`
- DELETE `/admin/outlets/:id`
- PATCH `/admin/orders/:id/assign-agent`
- GET `/admin/staff`
- POST `/admin/staff`
- PUT `/admin/staff/:id`
- DELETE `/admin/staff/:id`
- POST `/admin/agents`
- DELETE `/admin/agents/:id`
- All `/admin/zones/*` endpoints
- All `/admin/config/*` endpoints

---

## 🎯 Total Endpoints

- **Total:** 40+ endpoints
- **Public:** 7 endpoints
- **Authenticated:** 35+ endpoints
- **Admin Only:** 15+ endpoints

---

## 🔗 Quick Test

**Test in browser:** `http://localhost:5000/api-tester.html`

**Test with curl:**
```bash
# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin123"}'

# Get menu
curl http://localhost:5000/api/menu

# Get orders (with auth)
curl http://localhost:5000/admin/orders/admin/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```
