export class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === 'ZodError' ? 400 : 500);
  const body = { error: status === 500 ? 'Unexpected server error' : error.message };
  if (error.details) body.details = error.details;
  if (error.name === 'ZodError') body.details = error.issues;
  res.status(status).json(body);
}
