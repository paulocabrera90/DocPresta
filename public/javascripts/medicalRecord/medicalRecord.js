document.addEventListener('DOMContentLoaded', function() {
    // Asegúrate de que el DOM esté completamente cargado
    document.getElementById('newElementMedicalRecord').addEventListener('click', function(event) {
        // Previene el comportamiento por defecto del enlace
        event.preventDefault();

        // Hace una solicitud GET al href del enlace
        fetch(this.getAttribute('href'))
            .then(response => {
                if (response.ok) {
                    return response.json(); // o response.text() si esperas texto
                } else {
                    throw new Error('Algo salió mal en la solicitud');
                }
            })
            .then(data => {
                // Manejo exitoso de la respuesta
                console.log('Respuesta recibida:', data);
                // Aquí puedes añadir lo que desees hacer con la respuesta
            })
            .catch(error => {
                // Manejo de errores
                console.error('Error en la solicitud:', error);
            });
    });
});