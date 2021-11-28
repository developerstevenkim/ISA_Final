const errorHandler = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.code && (err.code >= 100 && err.code < 600) ? err.code : 400;
  res.status(statusCode)
     .json({
       message: err.message
     });
}

module.exports = errorHandler;
