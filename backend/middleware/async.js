const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error('Async handler error:', error);
    next(error);
  });
};

module.exports = asyncHandler;