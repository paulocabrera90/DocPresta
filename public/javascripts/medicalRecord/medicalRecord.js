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
                    showAlert('Error', error.message, 'error');
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

    const buttonElegirPrestaci = document.getElementById('button-elegirPrestaci');
    if(buttonElegirPrestaci){
        buttonElegirPrestaci.addEventListener('click', function(event) {
            showSpinner(true);
    
            setTimeout(() => {
                var overlay = document.getElementById('overlayMedicalRecord');
                var popup = document.querySelector('.popupMedicalRecord');
                if (overlay && popup) {
                    overlay.style.display = 'flex';
                    popup.style.display = 'flex';
                    attachElegirPrestRequest();
                }
            }, 1000);
        });
    }else{
        console.log("No se encontró el elemento 'button-elegirPrestaci'.");
    }

    const buttonSearchMedicine = document.getElementById('button-searchListMedicine');
    if(buttonSearchMedicine){
        buttonSearchMedicine.addEventListener('click', function(event) {
            showSpinner(true);
    
            setTimeout(() => {
                var overlay = document.getElementById('overlayMedicine');
                var popup = document.querySelector('.popupMedicine');
                if (overlay && popup) {
                    overlay.style.display = 'flex';
                    popup.style.display = 'flex';
                    attachSearchMedicineRequest();
                }
            }, 1000);
        });
    }else{
        console.log("No se encontró el elemento 'button-searchListMedicine'.");
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
            const url = `/api/benefit?format=json&search=${queryParam}&state=true`; 
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

    async function attachSearchMedicineRequest() {
        const medicamentoInput = document.getElementById('medicamentos');
        const popupListMedicine = document.getElementById('popupMedicine');
        showSpinner(false);
        if (popupListMedicine) {
           
            const queryParam = encodeURIComponent(medicamentoInput.value.trim());
            const url = `/api/medicine?format=json&search=${queryParam}&state=true`;
            const method = 'GET';

                console.log('Fetching  Medicine:', url);
        
                fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(result => {
                    if (result.medicines) {
                        console.log(result.medicine);
                        displayMedicines(result.medicines);
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

    async function attachElegirPrestRequest() {
        const patientId = document.getElementById('patientId');
        const popupListMedicalRecord = document.getElementById('popupMedicalRecord');
        showSpinner(false);
        if (popupListMedicalRecord) {
           
            const queryParam = encodeURIComponent(patientId.value.trim());
            const url = `/api/medical-record/patient/${queryParam}?format=json`; 
            const method = 'GET';

                console.log('Fetching  Medical Record:', url);
        
                fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(result => {
                    if (result.medicalRecords) {
                        console.log(result.medicalRecords);
                        displayMedicalRecords(result.medicalRecords);
                        showSpinner(false);
                    } else {
                        throw new Error('No se recibieron datos');
                    }
                })
                .catch(error => {
                    console.error('Error fetching medical Records:', error);
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

    const form = document.getElementById('form-medical-record');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            if (!validateMedications()) {
                await showAlert(
                    'Atención!',
                     'Por favor elija una medicación del listado.',
                     'warning'
                )
                return;
            }
            showSpinner(true);
    
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                if (data.hasOwnProperty(key)) {
                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            });
            const medicalRecordId = form.getAttribute("data-id");
    
            const isUpdate = medicalRecordId ? true : false;
            const url = isUpdate ? `/api/medical-record/update/${medicalRecordId}` : '/api/medical-record/create';
            const method = isUpdate ? 'PATCH' : 'POST';
    
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
    
                const result = await response.json();
                if (!response.ok) {
                    throw new Error('Algo salió mal en el servidor: ' + response.statusText);
                }

                await showAlert(
                    isUpdate ? 'Actualizado' : 'Creado',
                     isUpdate ? `Se actualizó correctamente la prescripción` : 'Se agregó correctamente la prescripción',
                     'success'
                )
                showSpinner(false);
                window.location.href = '/api/medical-record';
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.message,
                    confirmButtonColor: '#d33',
                });
                showSpinner(false);
            }
        });
    } else {
        console.log("No se encontró el formulario.");
    }

    var popup = document.querySelector('.popupPres');
    popup.addEventListener('click', function(event) {
        event.stopPropagation(); 
    });

    function validateMedications() {
        return document.querySelector('.medicines-list-container').hasChildNodes();
    }

    function displayBenefits(benefits) {
        const benefitsListContainer = document.querySelector('.benefits-list-container-popup');
        benefitsListContainer.innerHTML = '';
    
        // Crear la tabla y sus cabeceras
        const table = document.createElement('table');
        table.className = 'table table-striped'; 
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        ['Seleccionar','Nombre', 'Código', 'Descripción', 'Justificación', 'Sección'].forEach(text => {
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
    
    function displayMedicines(medicines) {
        const medicinesListContainer = document.querySelector('.medicine-list-container-popup');
        medicinesListContainer.innerHTML = '';
    
        // Create the table and its headers
        const table = document.createElement('table');
        table.className = 'table table-striped';
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        ['Seleccionar', 'Nombre', 'Código', 'Comercial', 'Concentrado (Cant. y Mag.)', 'Forma Farmacéutica', 'Familia'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);
    
        // Body of the table
        const tbody = document.createElement('tbody');
    
        medicines.forEach(medicine => {
            const tr = document.createElement('tr');
    
            // Checkbox
            const tdCheck = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'medicineSelected';
            checkbox.className = 'medicineSelected';
            checkbox.value = medicine.id;
            tdCheck.appendChild(checkbox);
            tr.appendChild(tdCheck);
            
            // Commercial Name (concatenate all commercial names if multiple)
            const tdName = document.createElement('td');
            tdName.textContent = medicine.name.toUpperCase(); 
            tr.appendChild(tdName);           
    
            // Code
            const tdCode = document.createElement('td');
            tdCode.textContent = medicine.code;
            tr.appendChild(tdCode);
    
            // Name
            const tdNameCom = document.createElement('td');
            tdNameCom.textContent = medicine.ComercialMedicines.map(m => m.name).join(', ');
            tr.appendChild(tdNameCom);
    
            // Concentrated Medicines description (concatenate quantity and magnitude)
            const tdConcentratedMedicines = document.createElement('td');
            tdConcentratedMedicines.textContent = medicine.ConcentratedMedicines.map(cm => `${cm.quantity} ${cm.magnitude}`).join(', ');
            tr.appendChild(tdConcentratedMedicines);
    
            // Pharmaceutical Forms (concatenate all forms if multiple)
            const tdPharmaForms = document.createElement('td');
            tdPharmaForms.textContent = medicine.PharmaForms.map(pf => pf.name).join(', ');
            tr.appendChild(tdPharmaForms);
    
            // Family (concatenate all family names if multiple)
            const tdFamily = document.createElement('td');
            tdFamily.textContent = medicine.FamilyMedicines.map(fm => fm.name).join(', ');
            tr.appendChild(tdFamily);
    
            tbody.appendChild(tr);
        });
    
        table.appendChild(tbody);
        medicinesListContainer.appendChild(table);
    }
    
    function displayMedicalRecords(medicalRecords) {
        const medicalrecordListContainer = document.querySelector('.medicalrecord-list-container-popup');
        medicalrecordListContainer.innerHTML = '';
    
        // Crear la tabla y sus cabeceras
        const table = document.createElement('table');
        table.className = 'table table-striped'; 
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        ['Seleccionar', 'Fecha de Prescripción', 'Vigencia (días)', 'Fecha de Modificación', 'Enfermedad (Código - Descripción)', 'Profesional (Nombre Apellido)'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);
    
        // Cuerpo de la tabla
        const tbody = document.createElement('tbody');
    
        medicalRecords.forEach(medicalRecord => {
                const tr = document.createElement('tr');
    
                // Radio button para selección única
                const tdCheck = document.createElement('td');
                const radioButton = document.createElement('input');
                radioButton.type = 'radio';
                radioButton.name = 'medicalRecordSelected';
                radioButton.className = 'medicalRecordRadioButton';
                radioButton.id = 'medicalRecordId-' + medicalRecord.id;
                radioButton.value = medicalRecord.id;
                tdCheck.appendChild(radioButton);
                tr.appendChild(tdCheck);
                
                // Fecha de Prescripción
                const tdPrescriptionDate = document.createElement('td');
                tdPrescriptionDate.textContent = new Date(medicalRecord.prescriptionDate).toLocaleDateString();
                tr.appendChild(tdPrescriptionDate);

                // Fecha de Modificación
                const tdModificationDate = document.createElement('td');
                tdModificationDate.textContent = new Date(medicalRecord.modificationDate).toLocaleDateString();
                tr.appendChild(tdModificationDate);

                // Vigencia
                const tdValidate = document.createElement('td');
                tdValidate.textContent = medicalRecord.validate;
                tr.appendChild(tdValidate);

                // Enfermedad (Código - Descripción)
                const tdSickness = document.createElement('td');
                tdSickness.textContent = `${medicalRecord.Sicknesses.code} - ${medicalRecord.Sicknesses.name}`;
                tr.appendChild(tdSickness);

                // Profesional (Nombre Apellido)
                const tdProfessional = document.createElement('td');
                tdProfessional.textContent = `${medicalRecord.Profesionals.User.Person.firstName} ${medicalRecord.Profesionals.User.Person.lastName}`;
                tr.appendChild(tdProfessional);

                tbody.appendChild(tr);
            
        });
    
        table.appendChild(tbody);
        medicalrecordListContainer.appendChild(table);
    }
    
});

function closePopup() {    
    var overlay = document.getElementById('overlayPrestacion');
    overlay.style.display = 'none';
    var popup = document.querySelector('.popupPres');
    popup.style.display = 'none';
}

function closePopupMedicine() {    
    var overlay = document.getElementById('overlayMedicine');
    overlay.style.display = 'none';
    var popup = document.querySelector('.popupMedicine');
    popup.style.display = 'none';
}

function closePopupMedicalRecord() {    
    var overlay = document.getElementById('overlayMedicalRecord');
    overlay.style.display = 'none';
    var popup = document.querySelector('.popupMedicalRecord');
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
        document.getElementById('tratamiento').value = selectedSickness.treatment
        document.getElementById('fecha_prescripcion').value = new Date().toISOString().split('T')[0];
        document.getElementById('vigencia').value = "Vigencia por defecto"; 
    } 
}

function editarObraSocial(){
    document.getElementById('paciente_obra_social').disabled = false;
    document.getElementById('paciente_plan').disabled = false;
}

function clearFieldsPrest() {
    document.getElementById('enfermedad-nombre').value = '';
    document.getElementById('enfermedad-code').value = '';
    document.getElementById('diagnostico').value = '';
    document.getElementById('fecha_prescripcion').value = '';
    document.getElementById('vigencia').value = '';
    document.getElementById('sicknessList').selectedIndex = 0; 

    // document.getElementById('enfermedad-nombre').disabled = false;
    // document.getElementById('enfermedad-code').disabled = false;
    // document.getElementById('diagnostico').disabled = false;
    // document.getElementById('fecha_prescripcion').disabled = false;
}

function agregarListadoPrest() {
    const selectedCheckboxes = document.querySelectorAll('.benefitSelected:checked');

    const selectedBenefits = Array.from(selectedCheckboxes).map(checkbox => {
        return {
            id: checkbox.value,
            name: checkbox.closest('tr').querySelector('td:nth-child(2)').textContent,
            code: checkbox.closest('tr').querySelector('td:nth-child(3)').textContent 
        };
    });

    const benefitsListContainer = document.querySelector('.benefits-list-container');

   // benefitsListContainer.innerHTML = '';

    selectedBenefits.forEach(benefit => {
        const benefitDiv = document.createElement('div');
        benefitDiv.className = 'benefit-item';
        benefitDiv.innerHTML = `<strong>Prestación: ${benefit.name} - ${benefit.code}</strong>` ;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete-benefit';
        deleteButton.onclick = function() {
            benefitDiv.remove();
        };

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'benefits';
        input.value = benefit.id;
        benefitDiv.appendChild(input);

        benefitDiv.appendChild(deleteButton);
        benefitsListContainer.appendChild(benefitDiv);
    });

    console.log(selectedBenefits);
    closePopup();
}

function agregarListadoMedicine() {
    const selectedCheckboxes = document.querySelectorAll('.medicineSelected:checked');

    const selectedMedicines = Array.from(selectedCheckboxes).map(checkbox => {
        return {
            id: checkbox.value,
            name: checkbox.closest('tr').querySelector('td:nth-child(2)').textContent,
            code: checkbox.closest('tr').querySelector('td:nth-child(3)').textContent 
        };
    });

    const medicinesListContainer = document.querySelector('.medicines-list-container');

   // medicinesListContainer.innerHTML = '';

    selectedMedicines.forEach(medicine => {
        const medicineDiv = document.createElement('div');
        medicineDiv.className = 'medicine-item';
        medicineDiv.innerHTML = `<strong> Medicamento: ${medicine.name} (Código: ${medicine.code})</strong>`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete-medicine';
        deleteButton.onclick = function() {
            medicineDiv.remove();
        };

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'medications';
        input.value = medicine.id;
        medicineDiv.appendChild(input);

        medicineDiv.appendChild(deleteButton);
        medicinesListContainer.appendChild(medicineDiv);
    });

    console.log(selectedMedicines);
    closePopupMedicine();
}

async function abrirPrescripcionExistente(){
    const selectedRadio = document.querySelector('input[name="medicalRecordSelected"]:checked').value;
    const primaryMedicalRecordId = document.getElementById('medicalRecordIdPri').value;

    try {
        const result = await Swal.fire({
            title: '¿Confirmas tu decisión?',
            text: 'Esta acción no puede deshacerse.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            
            showSpinner(true);
            const url = `/api/medical-record/${selectedRadio}?format=json` 
            const method = 'GET';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.medicalRecords) {
                    console.log(result.medicalRecords);
                    displayMedicalRecords(result.medicalRecords);
                    showSpinner(false);
                } else {
                    throw new Error('No se recibieron datos');
                }
            })
            .catch(error => {
                console.error('Error fetching medical Records:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.message,
                    confirmButtonColor: '#d33',
                });
                showSpinner(false);
            });
        } else if (result.isDismissed) {
            console.log('La acción fue cancelada anteriormente');
        }
    } catch (error) {
        console.error('Error al mostrar Swal', error);
    }
}

function displayMedicalRecords(medicalRecord) {
    
}