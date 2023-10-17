const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

async function login(email, password) {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

//   console.log(user)
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Invalid password');
  }

  // Create a signed JWT token
  const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET,
    { expiresIn: '1d' } 
  );

  return { user, token };

}

module.exports = {
  login
}