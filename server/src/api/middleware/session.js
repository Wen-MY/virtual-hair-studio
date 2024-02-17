const checkSessionExpiration = (req, res, next) => {

    //console.log('session checked\n')
    const whitelist = ['/auth'];

    const skipSessionCheck = whitelist.some(route => req.path.startsWith(route));

    if (skipSessionCheck) {
        return next(); // Move to the next middleware/route handler
    }

    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Failed to retrieve user account. Session expired' });
    }
    
    req.userId = userId; // Attach userId to the request object for later use
    next();
};

module.exports = { checkSessionExpiration };
