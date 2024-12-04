document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('button-addPrestacion').addEventListener('click', function() {
        var overlay = document.getElementById('overlayPrestacion');
        overlay.style.display = 'flex'; // Mostrar el overlay
      });
      
    function closePopup() {
        document.getElementById('overlayPrestacion').style.display = 'none'; // Ocultar el overlay
      }
      
    document.getElementById('newElementMedicalRecord').addEventListener('click', function(event) {
        event.preventDefault();

        fetch(this.getAttribute('href'))
            .then(response => {
                if (response.ok) {
                    window.location.href = '/api/medical-record/new';
                } else if (response.status === 401) {
                    return response.json().then(err => {
                        throw new Error(err.msg || "No tienes permiso para realizar esta acción.");
                    });
                } else {
                    throw new Error('Algo salió mal en la solicitud. Por favor intenta de nuevo.');
                }
            })
            .then(data => {               
                console.log('Respuesta recibida:', data);              
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                showAlert('Acceso Denegado', error.message, 'error');

            });
    });
});