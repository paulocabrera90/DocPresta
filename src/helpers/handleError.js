const httpError = (res, err) => {
    console.error('Error:', err);
    const statusCode = err.status || 500;

    let errorMessage = {
        error: err.code || 'InternalServerError',
        msg: err.details || err.message || 'An unexpected error occurred'
    };

    // Handle specific error codes
    switch (statusCode) {
        case 400:
            errorMessage.msg = 'Bad request. ' + errorMessage.msg;
            break;
        case 401:
            errorMessage.error = 'Unauthorized';
            errorMessage.msg = 'No posees permisos.';
            break;
        case 404:
            errorMessage.error = 'NotFound';
            errorMessage.msg = 'Recurso no encontrado.';
            break;
        case 500:
        default:
            errorMessage.error = 'InternalServerError';
            errorMessage.msg = err.message;
            break;
    }

    res.status(statusCode).send(errorMessage);
}

function loginError(status, code, message) {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    return error;
}

module.exports = { httpError, loginError }