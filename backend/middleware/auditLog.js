function auditLog(req, _res, next) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    console.log(`[AUDIT] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  }

  next();
}

module.exports = auditLog;
