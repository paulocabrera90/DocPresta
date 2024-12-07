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

    const buttonSearchPrestaci = document.getElementById('button-searchPrestaci');
    if(buttonSearchPrestaci){
        buttonSearchPrestaci.addEventListener('click', function(event) {
            showSpinner(true);
    
            setTimeout(() => {
                var overlay = document.getElementById('overlayPrestacion');
                var popup = document.querySelector('.popupPres');
                if (overlay && popup) {
                    overlay.style.display = 'flex';
                    popup.style.display = 'flex';
                    attachSearchRequest();
                }
            }, 1000);
        });
    }else{
        console.log("No se encontró el elemento 'button-searchPrestaci'.");
    }
    
    const clearListBenefitButton = document.getElementById('button-clearListBenefit');
    if (clearListBenefitButton) {
        clearListBenefitButton.addEventListener('click', function(event) {
            const benefitsListContainer = document.querySelector('.benefits-list-container');

            if (benefitsListContainer) {
                benefitsListContainer.innerHTML = '';
            } else {
                console.log("No se encontró el contenedor '.benefits-list-container'.");
            }
        });
    } else {
        console.log("No se encontró el elemento 'button-clearListBenefit'.");
    }
    
    const overlayPrestacion = document.getElementById('overlayPrestacion');
    if (overlayPrestacion) {
        overlayPrestacion.addEventListener('click', closePopup);
    } else {
        console.log("No se encontró el elemento 'overlayPrestacion'.");
    }

    async function attachSearchRequest() {
        const mainInput = document.getElementById('prestaciones');
        const sectionIdInput = document.getElementById('sectionId');
        const popupListBenefit = document.getElementById('popupPrestacion');
        showSpinner(false);
        if (popupListBenefit) {
           
            const queryParam = encodeURIComponent(mainInput.value.trim());
            const url = `/api/benefit?format=json&search=${queryParam}`; 
            const method = 'GET';

                console.log('Fetching  Benefit:', url);
        
                fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(result => {
                    if (result.benefits) {
                        console.log(result.benefits);
                        displayBenefits(result.benefits);
                        showSpinner(false);
                    } else {
                        throw new Error('No se recibieron datos');
                    }
                })
                .catch(error => {
                    console.error('Error fetching benefits:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.message,
                        confirmButtonColor: '#d33',
                    });
                    showSpinner(false);
                });
                        
        } else {
            showSpinner(false);
            console.log("No se encontró el formulario.");
        }
    }
    
    var popup = document.querySelector('.popupPres');
    popup.addEventListener('click', function(event) {
        event.stopPropagation(); 
    });

    function displayBenefits(benefits) {
        const benefitsListContainer = document.querySelector('.benefits-list-container-popup');
        benefitsListContainer.innerHTML = '';
    
        // Crear la tabla y sus cabeceras
        const table = document.createElement('table');
        table.className = 'table table-striped'; 
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        ['Seleccionar','Nombre', 'Código', 'Descripción', 'Justificación', 'Estado', 'Sección'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);
    
        // Cuerpo de la tabla
        const tbody = document.createElement('tbody');
    
        benefits.forEach(benefit => {
            const tr = document.createElement('tr');

            // Checkbox
            const tdCheck = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'benefitSelected';
            checkbox.className = 'benefitSelected';
            checkbox.value = benefit.id;
            tdCheck.appendChild(checkbox);
            tr.appendChild(tdCheck);
            
            // Nombre
            const tdName = document.createElement('td');
            tdName.textContent = benefit.name;
            tr.appendChild(tdName);
    
            // Código
            const tdCode = document.createElement('td');
            tdCode.textContent = benefit.code;
            tr.appendChild(tdCode);
    
            // Descripción
            const tdDescription = document.createElement('td');
            tdDescription.textContent = benefit.description;
            tr.appendChild(tdDescription);
    
            // Justificación
            const tdJustification = document.createElement('td');
            tdJustification.textContent = benefit.justification;
            tr.appendChild(tdJustification);
    
            // Estado
            const tdState = document.createElement('td');
            tdState.textContent = benefit.state ? 'Activo' : 'Inactivo';
            tr.appendChild(tdState);
    
            // Sección
            const tdSection = document.createElement('td');
            tdSection.textContent = benefit.Sections.code + "-" + benefit.Sections.name; 
            tr.appendChild(tdSection);
    
            // Campo oculto para el ID
            const tdId = document.createElement('td');
            tdId.style.display = 'none';
            tdId.textContent = benefit.id;
            tr.appendChild(tdId);
    
            tbody.appendChild(tr);
        });
    
        table.appendChild(tbody);
        benefitsListContainer.appendChild(table);
    }

    
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
        document.getElementById('paciente_obra_social').disabled = true;
        document.getElementById('paciente_plan').disabled = true;
    } else {
        document.getElementById('enfermedad-nombre').disabled = false;
        document.getElementById('enfermedad-code').disabled = false;
        document.getElementById('diagnostico').disabled = false;
        document.getElementById('fecha_prescripcion').disabled = false;
        document.getElementById('paciente_obra_social').disabled = true;
        document.getElementById('paciente_plan').disabled = true;
    }
}

function editarObraSocial(){
    document.getElementById('paciente_obra_social').disabled = false;
    document.getElementById('paciente_plan').disabled = false;
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

function agregarListadoPrest() {
    const selectedCheckboxes = document.querySelectorAll('.benefitSelected:checked');

    const selectedBenefits = Array.from(selectedCheckboxes).map(checkbox => {
        return {
            id: checkbox.value,
            name: checkbox.closest('tr').querySelector('td:nth-child(2)').textContent, // Nombre es el segundo td
            code: checkbox.closest('tr').querySelector('td:nth-child(3)').textContent // Código es el tercer td
        };
    });

    const benefitsListContainer = document.querySelector('.benefits-list-container');

    benefitsListContainer.innerHTML = '';

    selectedBenefits.forEach(benefit => {
        const benefitDiv = document.createElement('div');
        benefitDiv.className = 'benefit-item';
        benefitDiv.innerHTML = `<strong>${benefit.name} (Código: ${benefit.code})</strong>` ;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete-benefit';
        deleteButton.onclick = function() {
            benefitDiv.remove(); // Elimina el div del beneficio del DOM
        };

        benefitDiv.appendChild(deleteButton);
        benefitsListContainer.appendChild(benefitDiv);
    });

    console.log(selectedBenefits);
    closePopup();
}
