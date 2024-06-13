document.addEventListener('DOMContentLoaded', function() {   

    const profesionInput = document.getElementById('profesionInput');
    const specialityList = document.getElementById('specialityList');
    const specialitiesData = JSON.parse(document.getElementById('specialitiesData').textContent);

    // Función para actualizar la lista de especialidades
    function updateSpecialityList(profesionNameId) {
        const filteredSpecialities = specialitiesData.filter(s => s.profesionId === profesionNameId);
        specialityList.innerHTML = '';  // Limpia las opciones existentes
        filteredSpecialities.forEach(speciality => {
            const option = document.createElement('option');
            option.value = speciality.name;
            option.textContent = speciality.name;
            specialityList.appendChild(option);
        });
        if (!filteredSpecialities.length) {
            specialityList.innerHTML = '<option value="">No hay especialidades disponibles</option>';
        }
    }

    // Escuchar cambios en el input de profesion
    profesionInput.addEventListener('input', function() {
        const selectedOption = document.querySelector(`#profesionList option[value="${profesionInput.value}"]`);
        if (selectedOption && selectedOption.dataset.id) {
            updateSpecialityList(parseInt(selectedOption.dataset.id));
        } else {
            specialityList.innerHTML = '<option value="">Seleccione una Profesión primero</option>';
        }
    });

    

    //_______________________________________________________________________________-
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        showSpinner(true)
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const profId = form.getAttribute("data-id");

        const isUpdate = profId? true : false;
        const url = isUpdate ? `/api/profesional/update/${profId}` : '/api/profesional/create';
        const method = isUpdate ? 'PATCH' : 'POST';
       
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                // Include other necessary headers, e.g., authorization
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json();  // Suponiendo que el servidor responde con JSON
            } else {
                // Lanza un error que llevará al bloque .catch con más información
                throw new Error('Algo salió mal en el servidor: ' + response.statusText);
            }
        }).then(result => {
            console.log('Success:', result);
            const message = isUpdate ? `Se actualizo correctamente el Profesional` : 'Se agrego correctamente el Profesional';
            alert(message);
            showSpinner(false)
            window.location.href = '/api/profesional';
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('Ocurrio un error. Intente nuevamente.');
        });
    });
    
});

document.getElementById('specialityInput').addEventListener('change', function() {
    var selectedSpeciality = this.value;
    var specialitiesData = JSON.parse(document.getElementById('specialitiesData').textContent);
    var specialityIdInput = document.getElementById('specialityId');

    var selectedSpecialityId = specialitiesData.find(function(speciality) {
        return speciality.name === selectedSpeciality;
    }).id;

    specialityIdInput.value = selectedSpecialityId;
});

