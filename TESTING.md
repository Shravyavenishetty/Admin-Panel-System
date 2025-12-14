# Testing Instructions for Admin Panel

Follow these steps to test the complete authentication system:

## Prerequisites

Before testing, ensure you have:
1. ✅ MongoDB Atlas cluster created
2. ✅ Connection string updated in `backend/.env`
3. ✅ Dependencies installed in both frontend and backend

---

## Step 1: Set Up MongoDB Atlas

If you haven't already, follow the instructions in `MONGODB_SETUP.md` to:
1. Create a MongoDB Atlas account
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env` with your connection string

---

## Step 2: Seed the Database

```bash
cd backend
npm run seed
```

**Expected Output:**
```
✅ MongoDB connected successfully: cluster0.xxxxx.mongodb.net
✅ Admin user created successfully:
   Email: admin@admin.com
   Password: admin123
   Name: Admin User
✅ Database connection closed
```

If you see "⚠️  Admin user already exists", that's fine - it means the user is already in the database.

---

## Step 3: Start the Backend Server

```bash
# In the backend directory
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000 in development mode
✅ MongoDB connected successfully: cluster0.xxxxx.mongodb.net
```

Keep this terminal running!

---

## Step 4: Start the Frontend Server

Open a **new terminal window**:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 5: Test the Login Flow

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Should Auto-Redirect**: You should automatically be redirected to the login page
3. **Enter Credentials**:
   - Email: `admin@admin.com`
   - Password: `admin123`
4. **Click Login**: Click the "Login" button
5. **Verify Dashboard**: You should be redirected to the dashboard page
6. **Check Dashboard**: Confirm you see:
   - "Welcome to Admin Panel" message
   - Stats cards showing 0 (placeholders)
   - Logout button in the header

---

## Step 6: Test Protected Routes

1. **While logged in**, copy the current URL (should be `http://localhost:5173/dashboard`)
2. **Click Logout**: Click the logout button in the header
3. **Verify Redirect**: You should be redirected back to the login page
4. **Try Direct Access**: Paste the dashboard URL (`http://localhost:5173/dashboard`) in the browser
5. **Verify Protection**: You should be immediately redirected to the login page (because you're not authenticated)

---

## Step 7: Test Invalid Credentials

1. **Go to Login Page**: Navigate to `http://localhost:5173/login`
2. **Enter Wrong Password**:
   - Email: `admin@admin.com`
   - Password: `wrongpassword`
3. **Click Login**
4. **Verify Error**: You should see an error message: "Invalid email or password"

---

## Step 8: Check Browser Console

1. **Open Browser DevTools**: Press F12 or Right-click → Inspect
2. **Go to Console Tab**
3. **Verify No Errors**: There should be NO red errors in the console
4. **Check Network Tab**:
   - Click "Login" again with correct credentials
   - Check the Network tab
   - Find the `/api/admin/login` request
   - Status should be `200 OK`
   - Response should contain a `token` field

---

## Step 9: Verify Token Storage

1 **Login Successfully**
2. **Open DevTools → Application/Storage Tab**
3. **Local Storage**: Click on `http://localhost:5173`
4. **Find Token**: You should see Key: `admin_token` with a JWT value (long string)
5. **Logout**: Click logout button
6. **Verify Token Removed**: The `admin_token` should be removed from localStorage

---

## ✅ Test Checklist

Mark each test as you complete it:

- [ ] MongoDB connection successful
- [ ] Admin user seeded in database
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Login page loads correctly
- [ ] Login with valid credentials works
- [ ] Redirects to dashboard after login
- [ ] Dashboard displays correctly
- [ ] Logout button works
- [ ] Protected route redirects when not authenticated
- [ ] Invalid credentials show error message
- [ ] No console errors or warnings
- [ ] JWT token stored in localStorage
- [ ] Token removed on logout
- [ ] Network requests return 200 status

---

## 🐛 Troubleshooting

### Frontend won't load
- Check if Vite dev server is running: `npm run dev`
- Check browser console for errors
- Clear browser cache and reload

### Backend connection error
- Verify MongoDB connection string in `.env`
- Check if MongoDB cluster is active
- Verify network access rules in MongoDB Atlas

### Login not working
- Check backend terminal for errors
- Verify admin user exists: run `npm run seed` again
- Check Network tab for API response

### CORS errors
- Verify backend server is running on port 5000
- Check CORS configuration in `backend/src/server.js`

---

## 🎉 Success!

If all tests pass, you have successfully completed Task 1:
- ✅ Frontend with Vite + Tailwind
- ✅ Backend with Express + MongoDB
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Session Management

**Next**: Proceed to Task 2 for CRUD features!
