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