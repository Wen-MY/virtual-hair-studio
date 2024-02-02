const checkSessionExpiration = (req, res, next) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Failed to retrieve user account. Session expired' });
    }
    
    req.userId = userId; // Attach userId to the request object for later use
    next();
};

module.exports = { checkSessionExpiration };
