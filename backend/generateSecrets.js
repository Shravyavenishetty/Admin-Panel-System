/**
 * Secret Generator Script
 * Generates secure random secrets for JWT and Session
 * Run with: node generateSecrets.js
 */

const crypto = require('crypto');

// Generate secure random strings
const jwtSecret = crypto.randomBytes(64).toString('hex');
const sessionSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 Generated Secure Secrets:\n');
console.log('JWT_SECRET:');
console.log(jwtSecret);
console.log('\nSESSION_SECRET:');
console.log(sessionSecret);
console.log('\n✅ Copy these values to your .env file');
