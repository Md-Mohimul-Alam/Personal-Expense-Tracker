// Simple validation middleware without express-validator
const validateRequest = (req, res, next) => {
  // Basic required fields check
  const { body } = req;
  
  if (req.path === '/register') {
    if (!body.username || !body.email || !body.password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    if (body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
  }
  
  if (req.path === '/login') {
    if (!body.email || !body.password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
  }
  
  next();
};

module.exports = validateRequest;