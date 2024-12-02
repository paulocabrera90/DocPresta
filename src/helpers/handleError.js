const httpError = (res, err) => {
    console.error(err);
    const statusCode = err.status || 500;

    res.status(statusCode);

    let errorMessage = {
        error: err.code || 'InternalServerError',
        msg: err.message || 'An unexpected error occurred'
    };

    // Manejo específico para errores 401
    if (statusCode === 401) {
        errorMessage.error = 'Unauthorized';
        errorMessage.msg = 'You do not have permission to access this resource.';
    }

    res.send(errorMessage);
}

function loginError(status, code, message) {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    return error;
}

module.exports = { httpError, loginError }