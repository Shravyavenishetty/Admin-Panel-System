# MongoDB Atlas Setup Guide

This guide will help you set up a MongoDB Atlas cluster for the Admin Panel System.

## Step 1: Create MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Create an account using:
   - Email & Password, OR
   - Google account, OR
   - GitHub account

## Step 2: Create a New Cluster

1. After logging in, you'll see the **"Create a deployment"** page
2. Choose the **FREE** tier (M0 Sandbox)
   - Provider: AWS, Google Cloud, or Azure (choose any)
   - Region: Choose the region closest to you
3. Cluster Name: Keep default or name it `AdminPanelCluster`
4. Click **"Create Deployment"** (or "Create Cluster")
5. Wait 1-3 minutes for the cluster to be created

## Step 3: Create Database User

1. You'll see a **"Security Quickstart"** screen
2. Under **"Create a database user"**:
   - Username: `admin` (or your preferred username)
   - Password: Click "Autogenerate Secure Password" (save this!) OR create your own
   - Keep authentication method as **"Password"**
3. Click **"Create User"**

## Step 4: Add Network Access

1. Still on the Security Quickstart screen
2. Under **"Where would you like to connect from?"**:
   - For development: Choose **"My Local Environment"**
   - Click **"Add My Current IP Address"**
   - ⚠️ For easier development, you can also add `0.0.0.0/0` (allows access from anywhere - NOT recommended for production)
3. Click **"Add Entry"**
4. Click **"Finish and Close"**

## Step 5: Get Connection String

1. Click **"Go to Database"** or navigate to **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: Choose latest (4.1 or newer)
6. Copy the connection string - it looks like:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Backend .env File

1. Open `backend/.env` in your code editor
2. Replace `<password>` with your actual database user password
3. Add a database name after `.mongodb.net/` (e.g., `admin-panel`)

**Example:**
```env
MONGODB_URI=mongodb+srv://admin:YourPassword123@cluster0.abc123.mongodb.net/admin-panel?retryWrites=true&w=majority
```

## Step 7: Test Connection

1. Open terminal in the `backend` directory
2. Run the seed script to create admin user:
   ```bash
   npm run seed
   ```
3. You should see:
   ```
   ✅ MongoDB connected successfully
   ✅ Admin user created successfully
   ```

## Step 8: Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000 in development mode
```

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created successfully
- [ ] Database user created with password saved
- [ ] IP address added to network access list
- [ ] Connection string copied and updated in `.env`
- [ ] Seed script ran successfully
- [ ] Backend server starts without errors

---

## 🔧 Troubleshooting

### Error: "MongoNetworkError" or "connection refused"
- Check if your IP address is whitelisted in Network Access
- Try adding `0.0.0.0/0` for development (temporary)

### Error: "Authentication failed"
- Verify username and password in connection string
- Make sure password doesn't contain special characters without URL encoding

### Error: "Cannot find module"
- Run `npm install` in backend directory
- Make sure all dependencies are installed

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver Docs](https://mongodb.github.io/node-mongodb-native/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

**Next Step**: Once MongoDB is connected, proceed to test the admin login functionality!
