const jwt = require('jsonwebtoken');
const response = require('../helpers/response');

module.exports = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;

    // condition if server doesn't find jwt token in header
    if (!headers) {
      const newError = {
        message: 'server requires token in header',
      };
      throw newError;
    }

    const token = headers.split(' ')[1];
    // store token in req object
    req.user = await jwt.verify(token, process.env.JWT_PRIVATE_TOKEN);

    next();
  }
  catch (error0) {
    response({
      success: false,
      res,
      statusCode: 401,
      message: error0.message,
    });
  }
};
