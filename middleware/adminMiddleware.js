const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const adminMiddleware = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        const isAdmin = User.findById(req.user)
        if (isAdmin.role_id===1) {
            next();
        }else{
            res.status(401).json({ message: 'Invalid user' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = adminMiddleware