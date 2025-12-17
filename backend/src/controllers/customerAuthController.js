/**
 * Customer Authentication Controller
 */

const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');

/**
 * Customer login
 * POST /api/customer/login
 */
exports.customerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Find customer with password field
        const customer = await Customer.findOne({ email }).select('+password');

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if customer is active
        if (!customer.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is inactive',
            });
        }

        // Verify password
        const isPasswordValid = await customer.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: customer._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Remove password from response
        customer.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                role: 'customer',
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message,
        });
    }
};

/**
 * Customer registration
 * POST /api/customer/register
 */
exports.customerRegister = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
            });
        }

        // Create new customer
        const customer = await Customer.create({
            name,
            email,
            phone,
            password,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: customer._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                role: 'customer',
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error during registration',
            error: error.message,
        });
    }
};

/**
 * Get current customer profile
 * GET /api/customer/me
 */
exports.getCustomerProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message,
        });
    }
};
