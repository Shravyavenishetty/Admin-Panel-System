# 🔐 Environment Variables Setup Guide

This guide explains how to generate and set up secure environment variables for your admin panel.

---

## 📋 Required Environment Variables

Your `backend/.env` file needs these variables:

1. **MONGODB_URI** - MongoDB Atlas connection string
2. **JWT_SECRET** - Secret key for JWT token signing
3. **JWT_EXPIRES_IN** - Token expiration time
4. **PORT** - Server port number
5. **NODE_ENV** - Environment (development/production)
6. **SESSION_SECRET** - Secret key for session cookies

---

## 🔑 How to Generate Secure Secrets

### Method 1: Using Node.js (Recommended)

I've created a script for you at `backend/generateSecrets.js`:

```bash
cd backend
node generateSecrets.js
```

This will output:
```
🔐 Generated Secure Secrets:

JWT_SECRET:
[64-character hex string]

SESSION_SECRET:
[64-character hex string]
```

### Method 2: Using OpenSSL (Terminal)

```bash
# Generate JWT_SECRET
openssl rand -hex 64

# Generate SESSION_SECRET
openssl rand -hex 64
```

### Method 3: Online (NOT Recommended for Production)

Visit: https://www.random.org/strings/ or similar random string generators

---

## ✅ Complete .env File Content

Copy this into your `backend/.env` file (I've already generated the secrets for you):

```env
# Environment Variables - DO NOT COMMIT TO GIT

# MongoDB Configuration
MONGODB_URI=mongodb+srv://admin:4HbuatSq4ekZFV3q@cluster0.ix2iee1.mongodb.net/admin-panel?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=3f19caf065e45ed120c6a0ffef383b2a728eb7f842112a3d46913ac7dafc672c1a39e067c1a1b55b0915a008352000a9676ca3fc03920b31c97e67c3eb2afd79
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=c15959e8db1f854b28b9cf5041b1114cc4d25deed666c78b779b780f7c323799bc0de337e91519aba5ce698cd32f12736e2c69ad6d1e3e0c4d3cded408a6f2ee
```

---

## 🛡️ Security Notes

### Why These Secrets Matter:

1. **JWT_SECRET**: 
   - Used to sign and verify JWT tokens
   - If leaked, attackers can forge authentication tokens
   - **Must be long and random** (64+ characters)

2. **SESSION_SECRET**:
   - Used to sign session cookies
   - Prevents session hijacking
   - **Must be long and random** (64+ characters)

3. **MongoDB URI**:
   - Contains your database credentials
   - Never commit to git or share publicly

### Best Practices:

- ✅ Use different secrets for development and production
- ✅ Never commit `.env` files to git
- ✅ Use environment variables in production (not .env files)
- ✅ Rotate secrets periodically
- ✅ Use long, random strings (64+ characters)
- ❌ Don't use simple passwords or dictionary words
- ❌ Don't share secrets in plain text
- ❌ Don't reuse secrets across projects

---

## 📝 What Each Secret Does:

### JWT_SECRET
```javascript
// Used in: backend/src/utils/jwt.js
jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
```
- Signs tokens when admin logs in
- Verifies tokens on protected routes
- Ensures tokens haven't been tampered with

### SESSION_SECRET
```javascript
// Used in: backend/src/server.js
session({
  secret: process.env.SESSION_SECRET,
  // ... other options
})
```
- Signs session cookies
- Prevents session ID forgery
- Adds extra layer of security

---

## 🔄 How to Update Your .env File

1. Open `backend/.env` in your code editor
2. Replace the entire content with the complete .env content above
3. Save the file
4. The secrets are already generated and secure!

---

## ✅ Verification

After updating `.env`, verify it's working:

```bash
cd backend
npm run seed    # Should connect to MongoDB successfully
npm run dev     # Should start server without errors
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000 in development mode
```

---

## 🆘 Troubleshooting

### "MongooseServerSelectionError"
- Check MongoDB connection string
- Verify network access in MongoDB Atlas
- Ensure password doesn't have special characters (or URL encode them)

### "JWT secret or public key must be provided"
- Verify JWT_SECRET is set in .env
- Ensure no extra spaces or quotes around the value

### "Session secret is required"
- Verify SESSION_SECRET is set in .env
- Check for typos in variable name

---

**Your secrets are ready to use!** Just copy the complete .env content above into your `backend/.env` file.
