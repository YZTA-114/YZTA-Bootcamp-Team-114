const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // Log to console for dev
    console.error('Error details:', err);

    // Mongoose bad ObjectId
    if(err.name === 'CastError') {
        const message = `${err.model && err.model.modelName ? err.model.modelName : 'Resource'} not found with id of ${err.value || 'unknown'}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if(err.code === 11000) { // we know that this is a duplicate error
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if(err.name === 'ValidationError') {
        // get errors objects from error and combine all messages of validation errors like (description field is required, name field is required etc.)
        const message = Object.values(err.errors || {}).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    // Ensure we have a valid status code and message
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Server Error';

    res.status(statusCode).json({
        success: false,
        error: errorMessage
    });
}

module.exports = errorHandler;