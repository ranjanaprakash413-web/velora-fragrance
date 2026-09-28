/**
 * Centralized error handler
 * Ensures internal errors and sensitive stack traces are never exposed in production
 */
export function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: isDev ? message : (statusCode === 500 ? 'An unexpected error occurred. Please try again later.' : message),
    ...(isDev && { stack: err.stack })
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
}
