const jwt = require('jsonwebtoken');
const jwtSecret = process.env.TOKEN_SECRET_KEY;

const adminAuth = (req, res, next) => {

  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {

    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.isAdmin) {
      req.user = decoded;
      next();
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (err) {
    // Token verification failed
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Export the middleware function
module.exports = adminAuth;
