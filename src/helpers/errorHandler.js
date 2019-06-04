const handler = function errorHandler(err, req, res, next) {
  const { status = 500, message: error } = err;

  res.status(status).json({
    success: false,
    status,
    error
  });
};

export default handler;
