module.exports = ({
  success = true,
  res,
  statusCode = 200,
  data = null,
  message = null,
}) => {
  res.status(statusCode).json({
    success,
    statusCode,
    data,
    message,
  });
};
