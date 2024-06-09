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
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            const message = isUpdate ? `Se actualizo correctamente el Profesional` : 'Se agrego correctamente el Profesional';
            alert(message);
            window.location.href = '/api/profesional';
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('Ocurrio un error. Intente nuevamente.');
        });
    });

    function initProfesionList() {
        profesionOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.name;
            optionElement.textContent = option.name;
            profesionList.appendChild(optionElement);
        });
    }
    
    function initSpecialityList() {
        specialityList.innerHTML = '<option value="" selected>Seleccione una Especialidad</option>';
        specialities.forEach(speciality => {
            const option = document.createElement('option');
            option.value = speciality.name;
            option.textContent = speciality.name;
            specialityList.appendChild(option);
        });
    }
    
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

function profesionalPersistence(event){
  if (window.confirm("¿Estás seguro de que deseas eliminar este profesional?")) {
    const form = event.target.closest("form");
    const isUpdate = form.getAttribute("data-update");
    
    fetch(`/api/profesional/${profId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log("Profesional eliminado con éxito");
            alert(`Profesional con ID ${profId} eliminado con éxito`); 
        } else {
            console.error("Error al eliminar el profesional");
        }
    })
    .catch(error => {
        console.error("Error al enviar la solicitud DELETE", error);
    });
  }
}

