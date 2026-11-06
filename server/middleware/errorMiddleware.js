export const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode >= 400 ? res.statusCode : 500;

  let message = err.message || "Internal server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Record already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack
    })
  });
};