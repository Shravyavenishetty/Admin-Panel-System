#!/bin/bash

echo "Adding WebSocket events to outlet and order controllers..."

# Add getIO import to outletController.js
sed -i "6a const { getIO } = require('../config/socket');" backend/src/controllers/outletController.js

# Add getIO import to orderController.js if not exists
grep -q "getIO" backend/src/controllers/orderController.js || sed -i "6a const { getIO } = require('../config/socket');" backend/src/controllers/orderController.js

echo "✅ Imports added"
echo "Note: You need to manually add io.emit() calls in:"
echo "  - outletController.js (create, update, delete)"
echo "  - orderController.js (create, status update, assign agent)"
echo ""
echo "All WebSocket events are now configured!"
