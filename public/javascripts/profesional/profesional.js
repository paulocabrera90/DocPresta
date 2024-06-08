document.addEventListener('DOMContentLoaded', function() {
    const specialities = JSON.parse(document.getElementById('specialitiesData').textContent);
    
    const profesionInput = document.getElementById('profesionInput');
    const profesionList = document.getElementById('profesionList');
    const specialityList = document.getElementById('specialityList');
    const profesionOptions = profesionList.querySelectorAll('option');
  
    profesionInput.addEventListener('input', function() {
      const selectedProfesion = Array.from(profesionOptions).find(option => option.value === profesionInput.value);
      if (selectedProfesion) {
        const profesionId = parseInt(selectedProfesion.getAttribute('data-id'));
        specialityList.innerHTML = '<option value="" selected>Seleccione una Especialidad</option>';
        const filteredSpecialities = specialities.filter(speciality => speciality.profesionId === profesionId);
        filteredSpecialities.forEach(speciality => {
          const option = document.createElement('option');
          option.value = speciality.name;
          option.textContent = speciality.name;
          specialityList.appendChild(option);
        });
      }
    });

    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log("paso por aca, update ")
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
       
        const isUpdate = !!data.id;
        const url = isUpdate ? `/api/profesional/update/${data.id}` : '/api/profesional/create';
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
            alert('Se actualizo correctamente el Profesional');
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