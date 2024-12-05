document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('button-addPrestacion').addEventListener('click', function(event) {
        showSpinner(true);
    
        setTimeout(() => {
            var overlay = document.getElementById('overlayPrestacion');
            var popup = document.querySelector('.popupPres');
            overlay.style.display = 'flex';
            popup.style.display = 'flex';
                attachFormSubmitHandler();
            
        }, 3000);
    });  
    
    function attachFormSubmitHandler() {
        const mainInput = document.getElementById('prestaciones');
        const sectionIdInput = document.getElementById('sectionId');
        const form = document.getElementById('form-benefit-popup');
        showSpinner(false);
        if (form) {
            form.addEventListener('submit', async function(event) {
                event.preventDefault();
                showSpinner(true);
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const url = form.action;
                const method = form.method;

                console.log('Creating  Benefit:', url);
        
                try{
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        if (result.errors && Array.isArray(result.errors)) {          
                            let messages = result.errors.map(item => item.msg);
                            throw new Error(messages);
                        } else {
                            throw new Error('Algo salió mal en el servidor: ' + response.statusText);
                        }
                    }                

                    await showAlert(
                        'Creado',
                        'Se agregó correctamente  el paciente',
                        'success'
                    )

                    console.log("Redirigiendo...");
                    showSpinner(false)
                    mainInput.value = result.benefit.code + " " + result.benefit.name;  
                    sectionIdInput.value = result.benefit.id;

                    // Cierra el popup
                    closePopup();
                } catch (error) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.message,
                        confirmButtonColor: '#d33',
                    });
                    showSpinner(false);
                };
            });
        } else {
            showSpinner(false);
            console.log("No se encontró el formulario.");
        }
    }    
    
    document.getElementById('overlayPrestacion').addEventListener('click', closePopup);

    var popup = document.querySelector('.popupPres');
    popup.addEventListener('click', function(event) {
        event.stopPropagation(); // Detiene la propagación del evento al overlay
    });

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

function closePopup() {    
    var overlay = document.getElementById('overlayPrestacion');
    overlay.style.display = 'none';
    var popup = document.querySelector('.popupPres');
    popup.style.display = 'none';
}