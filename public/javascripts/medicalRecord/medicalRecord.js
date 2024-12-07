document.addEventListener('DOMContentLoaded', function() {

    const newElement = document.getElementById('newElementMedicalRecord');
    if (newElement) {
        newElement.addEventListener('click', function(event) {
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
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    showAlert('Acceso Denegado', error.message, 'error');
                });
        });
    } else {
        console.log("No se encontró el elemento 'newElementMedicalRecord'.");
    }

    const addPrestacionButton = document.getElementById('button-addPrestacion');
    if (addPrestacionButton) {
        addPrestacionButton.addEventListener('click', function(event) {
            showSpinner(true);
    
            setTimeout(() => {
                var overlay = document.getElementById('overlayPrestacion');
                var popup = document.querySelector('.popupPres');
                if (overlay && popup) {
                    overlay.style.display = 'flex';
                    popup.style.display = 'flex';
                    attachFormSubmitHandler();
                }
            }, 3000);
        });
    } else {
        console.log("No se encontró el elemento 'button-addPrestacion'.");
    }
    
    const overlayPrestacion = document.getElementById('overlayPrestacion');
    if (overlayPrestacion) {
        overlayPrestacion.addEventListener('click', closePopup);
    } else {
        console.log("No se encontró el elemento 'overlayPrestacion'.");
    }

    
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

    var popup = document.querySelector('.popupPres');
    popup.addEventListener('click', function(event) {
        event.stopPropagation(); // Detiene la propagación del evento al overlay
    });
});

function closePopup() {    
    var overlay = document.getElementById('overlayPrestacion');
    overlay.style.display = 'none';
    var popup = document.querySelector('.popupPres');
    popup.style.display = 'none';
}

function updateFields() {
    var select = document.getElementById('sicknessList');
    var selectedOption = select.options[select.selectedIndex];
    var sicknessData = JSON.parse(document.getElementById('sickness').value);

    var selectedSickness = sicknessData.find(sk => sk.id.toString() === selectedOption.value);

    if (selectedSickness) {
        document.getElementById('enfermedad-nombre').value = selectedSickness.name;
        document.getElementById('enfermedad-code').value = selectedSickness.code;
        document.getElementById('diagnostico').value = selectedSickness.description; 
        document.getElementById('fecha_prescripcion').value = new Date().toISOString().split('T')[0];
        document.getElementById('vigencia').value = "Vigencia por defecto"; 
        
        document.getElementById('enfermedad-nombre').disabled = true;
        document.getElementById('enfermedad-code').disabled = true;
        document.getElementById('diagnostico').disabled = true;
        document.getElementById('fecha_prescripcion').disabled = true;
    } else {
        document.getElementById('enfermedad-nombre').disabled = false;
        document.getElementById('enfermedad-code').disabled = false;
        document.getElementById('diagnostico').disabled = false;
        document.getElementById('fecha_prescripcion').disabled = false;
    }
}

function clearFields() {
    document.getElementById('enfermedad-nombre').value = '';
    document.getElementById('enfermedad-code').value = '';
    document.getElementById('diagnostico').value = '';
    document.getElementById('fecha_prescripcion').value = '';
    document.getElementById('vigencia').value = '';
    document.getElementById('sicknessList').selectedIndex = 0; 

    document.getElementById('enfermedad-nombre').disabled = false;
    document.getElementById('enfermedad-code').disabled = false;
    document.getElementById('diagnostico').disabled = false;
    document.getElementById('fecha_prescripcion').disabled = false;
}
