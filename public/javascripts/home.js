// Código JavaScript para obtener el token de sesión
var token = localStorage.getItem('tokenSession');
console.log('token', token);
// Si hay un token, lo incluimos en los encabezados de las solicitudes fetch
if (token) {
  fetch('http://localhost:4200/api/home', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(response => {
    // Manejar la respuesta...
  }).catch(error => {
    console.error('Error al enviar la solicitud:', error.message);
  });
}