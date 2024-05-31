document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("button-searchDni");
  
    if (button) {
      button.addEventListener("click", function(event) {
        event.preventDefault(); // Previene el comportamiento por defecto del botón de envío del formulario
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
  
      $('#acceptButton, #cancelButton, .overlay').click(function() {
        hidePopup();
      });
    }
  });
  
  function isValidDNI(dni) {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  }
  
  function showPopup(data) {
    $('#patientInfo').text(`Nombre: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nDNI: ${data.numberDocument}`);
    $('.overlay, .popup').show();
  }
  
  function hidePopup() {
    $('.overlay, .popup').hide();
  }
  