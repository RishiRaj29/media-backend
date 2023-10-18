const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const adminMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        const isAdmin = await User.findOne({_id:req.user.id}).populate('role')

        
        if (isAdmin.role.role_name==='Admin') {
            next();
        }else{
            res.status(401).json({ message: 'Invalid user' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Invalid token', error: err });
    }
}

module.exports = adminMiddleware