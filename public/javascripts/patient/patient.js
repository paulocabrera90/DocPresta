document.addEventListener('DOMContentLoaded', function() {   

    const socialWorkInput = document.getElementById('socialWorkInput');
    const plansOSList = document.getElementById('plansOSList');
    const plansOSData = JSON.parse(document.getElementById('plansOSData').textContent);

    // Función para actualizar la lista de planes
    function updateplansOSList(socialWorkId) {
        const filteredPlansOS = plansOSData.filter(s => s.socialWorkId === socialWorkId);
        plansOSList.innerHTML = '';  // Limpia las opciones existentes
        filteredPlansOS.forEach(plans => {
            const option = document.createElement('option');
            option.value = plans.name;
            option.textContent = plans.name;
            plansOSList.appendChild(option);
        });
        if (!filteredPlansOS.length) {
            plansOSList.innerHTML = '<option value="">No hay planes disponibles</option>';
        }
    }

    // Escuchar cambios en el input de obra social
    socialWorkInput.addEventListener('input', function() {
        const selectedOption = document.querySelector(`#socialWorkList option[value="${socialWorkInput.value}"]`);
        if (selectedOption && selectedOption.dataset.id) {
            updateplansOSList(parseInt(selectedOption.dataset.id));
        } else {
            plansOSList.innerHTML = '<option value="">Seleccione una Obra social primero</option>';
        }
    });

    //_______________________________________________________________________________-
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const patientId = form.getAttribute("data-id");

        const isUpdate = patientId? true : false;
        const url = isUpdate ? `/api/patient/update/${patientId}` : '/api/patient/create';
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
            const message = isUpdate ? `Se actualizo correctamente el Paciente` : 'Se agrego correctamente el Paciente';
            alert(message);
            window.location.href = '/api/patient';
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('Ocurrio un error. Intente nuevamente.');
        });
    });
    
});

document.getElementById('planOSInput').addEventListener('change', function() {
    var selectedPlanOS = this.value;
    var plansOSData = JSON.parse(document.getElementById('plansOSData').textContent);
    var planOSIdInput = document.getElementById('planOSId');

    var selectedPlanOSId = plansOSData.find(function(planOS) {
        return planOS.name === selectedPlanOS;
    }).id;

    planOSIdInput.value = selectedPlanOSId;
});
