document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("button-searchDni");
  
    if (button) {
      button.addEventListener("click", function(event) {
        event.preventDefault();
        const dni = $('#prestaciones-dni').val().trim();
  
        if (!isValidDNI(dni)) {
          alert('Ingrese un DNI válido de 8 dígitos.');
          return;
        }
  
        $.ajax({
          url: `http://localhost:4200/api/users/${dni}`,
          method: 'GET',
          success: function(response) {
            if (response.data) {
              showPopup(response.data);
            } else {
              alert('Paciente no encontrado.');
            }
          },
          error: function() {
            alert('Error al buscar el paciente.');
          }
        });
      });
  
      $('#acceptButtonPopup, #acceptButtonPopup, .overlay').click(function() {
        hidePopup();
      });

      $('#acceptButtonPopup').click(function() {
        acceptPopup();
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
   $('#patientInfo').html(patientInfoHtml); 
   $('.overlay, .popup').show();
  }
  
  function hidePopup() {
    $('.overlay, .popup').hide();
  }
  
  function acceptPopup() {
    const patientData = {
        firstName: $('#patientInfo').find('p:nth-child(1)').text().split(': ')[1].split(' ')[0],
        lastName: $('#patientInfo').find('p:nth-child(1)').text().split(': ')[1].split(' ')[1],
        email: $('#patientInfo').find('p:nth-child(2)').text().split(': ')[1],
        numberDocument: $('#patientInfo').find('p:nth-child(3)').text().split(': ')[1],
        age: $('#patientInfo').find('p:nth-child(4)').text().split(': ')[1],
        typeDocument: $('#patientInfo').find('p:nth-child(5)').text().split(': ')[1],
        sex: $('#patientInfo').find('p:nth-child(6)').text().split(': ')[1],
        socialWork: $('#patientInfo').find('p:nth-child(8)').text().split(': ')[1],
        planOSName: $('#patientInfo').find('p:nth-child(9)').text().split(': ')[1],
    };

    $('#paciente_nombre').val(patientData.firstName);
    $('#paciente_apellido').val(patientData.lastName);
    $('#prestaciones-dni').val(patientData.numberDocument);
    $('#paciente_obra_social').val(patientData.socialWork);
    $('#paciente_plan').val(patientData.planOSName);
    $('#paciente_sexo').val(patientData.sex.toUpperCase() === 'FEMENINO' ? 'FEMALE' : patientData.sex.toUpperCase() === 'MASCULINO' ? 'MALE' : 'OTHER');

    hidePopup();
}