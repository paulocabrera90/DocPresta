document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("button-searchDni");
    let patientGlobal = {};
    
    if (button) {
      button.addEventListener("click", function(event) {
        event.preventDefault();
        const dni = $('#prestaciones-dni').val().trim();
  
        if (!isValidDNI(dni)) {
          alert('Ingrese un DNI válido de 8 dígitos.');
          return;
        }
  
        fetch(`http://localhost:4200/api/users/${dni}`)
        .then(response => response.json())
        .then(response => {
            if (response.data) {
              patientGlobal=response.data;
              showPopup(patientGlobal);
            } else {
                alert('Paciente no encontrado.');
            }
        })
        .catch(() => {
            alert('Error al buscar el paciente.');
        });
      });

      document.getElementById('acceptButtonPopup').addEventListener('click', function() {
        acceptPopup(patientGlobal);
      });
    
      document.querySelectorAll('#acceptButtonPopup, #cancelButtonPopup, .overlay').forEach(element => {
        element.addEventListener('click', function() {
            hidePopup();
        });
      });
    }
  });
  
  function isValidDNI(dni) {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  }
  
  function showPopup(data) {
   // $('#patientInfo').text(`Nombre: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nDNI: ${data.numberDocument}`);
    let patientInfoHtml = `
      <p>Nombre: ${data.firstName} ${data.lastName}</p>
      <p>Email: ${data.email}</p>
      <p>DNI: ${data.numberDocument}</p>
      <p>Edad: ${data.age}</p>
      <p>Tipo de documento: ${data.typeDocument}</p>
      <p>Sexo: ${data.sex}</p>
      <p>Rol: ${data.rol}</p>
      <p>Obra Social: ${data.socialWork}</p>
      <p>Plan de Obra Social: ${data.planOSName}</p>
    `;
    document.getElementById('patientInfo').innerHTML = patientInfoHtml; 
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.popup').style.display = 'block';
  }
  
  function hidePopup() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.popup').style.display = 'none';
}

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
  
  function acceptPopup(patientGlobal) {
    const birthDate = formatDate(patientGlobal.birthDate);

    document.getElementById('paciente_nombre').value = patientGlobal.firstName;
    document.getElementById('paciente_apellido').value = patientGlobal.lastName;
    document.getElementById('prestaciones-dni').value = patientGlobal.numberDocument;
    document.getElementById('paciente_fecha_nacimiento').value = birthDate;
    document.getElementById('paciente_obra_social').value = patientGlobal.socialWork.name;
    document.getElementById('paciente_plan').value = patientGlobal.planOSName;
    document.getElementById('paciente_sexo').value = patientGlobal.sex.toUpperCase() === 'FEMENINO' ? 'FEMALE' : patientGlobal.sex.toUpperCase() === 'MASCULINO' ? 'MALE' : 'OTHER';

    hidePopup();
}