/**
 * Authorization Middleware
 * Checks if user has required role to access resource
 */

/**
 * Authorize middleware - Check if user has required role
 * @param {...string} roles - Allowed roles (admin, manager, user)
 * @returns Middleware function
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
        }

        // Check if user's role is in allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
            });
        }

        next();
    };
};

/**
 * Check if user owns the resource or is admin/manager
 * @param {Function} getOwnerId - Function to extract resource owner ID
 */
const checkOwnership = (getOwnerId) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
        }

        // Admin and Manager can access any resource
        if (req.user.role === 'admin' || req.user.role === 'manager') {
            return next();
        }

        try {
            const ownerId = await getOwnerId(req);

            // User can only access their own resources
            if (ownerId && ownerId.toString() === req.user._id.toString()) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own resources.',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error checking ownership',
                error: error.message,
            });
        }
    };
};

module.exports = {
    authorize,
    checkOwnership,
};
