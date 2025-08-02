const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Request body'yi validate et
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      
      // Query parametrelerini validate et
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      
      // URL parametrelerini validate et
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        // Zod validation hatalarını formatla
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Validasyon hatası',
          details: validationErrors
        });
      }
      
      next(error);
    }
  };
};

module.exports = validate; 