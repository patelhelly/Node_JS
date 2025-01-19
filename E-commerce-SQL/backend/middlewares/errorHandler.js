module.exports.errorHandler = (err, req, res, next) => {
  const statuscode = res.statusCode || 500;
  res.status(statuscode);
  res.json({
    status: "fail",
    message: err?.message,
    stack: err?.stack,
  });
  next();
};
