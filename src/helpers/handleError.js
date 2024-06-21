const httpError = (res, err) => {
    console.error(err); // Muestra el error completo en la consola
    res.status(err.status || 500); // Usa el código de estado del error, si está disponible
    res.send({
        error: err.code || 'InternalServerError',
        msg: err.message || 'An unexpected error occurred'
    });
}

function loginError(status, code, message) {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    return error;
}

module.exports = { httpError, loginError }