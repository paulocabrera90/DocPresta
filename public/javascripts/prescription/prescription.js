document.addEventListener("DOMContentLoaded", function() {
  const inputField = document.getElementById('prestaciones-dni');
  const dataList = document.getElementById('patientList');
  const patientsData = JSON.parse(document.getElementById('patientsData').value);
        
    let patientGlobal = {};
    
      dataList.addEventListener("change", function() {
        const selectedValue = this.value;
        const patient = patientsData.find(p => `${p.id}` === selectedValue);
        if (patient) {
            patientGlobal= patient
            showPopup(patient);
        }
      });

      document.getElementById('acceptButtonPopup').addEventListener('click', function() {
        acceptPopup(patientGlobal);
      });
    
      document.querySelectorAll('#acceptButtonPopup').forEach(element => {
        element.addEventListener('click', function() {
            hidePopup();
        });
      });
  });
  
  function isValidDNI(dni) {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  }
  
  function showPopup(data) {
    let patientInfoHtml = `
      <p>Nombre: ${data.firstName} ${data.lastName}</p>
      <p>Email: ${data.email}</p>
      <p>Tipo de documento: ${data.typeDocument}</p>
      <p>DNI: ${data.numberDocument}</p>
      <p>Fecha de nacimiento: ${formatDate(data.birthDate)}</p>      
      <p>Sexo: ${data.sex}</p>
      <p>Obra Social: ${data.socialWorkName}</p>
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

    const birthDateFormatted = formatDate(patientGlobal.birthDate);

    document.getElementById('patientId').value = patientGlobal.id;
    document.getElementById('paciente_nombre').value = patientGlobal.firstName;
    document.getElementById('paciente_apellido').value = patientGlobal.lastName;
    document.getElementById('paciente_fecha_nacimiento').value = birthDateFormatted;
    document.getElementById('paciente_obra_social').value = patientGlobal.socialWorkName;
    document.getElementById('paciente_plan').value = patientGlobal.planOSName;
    document.getElementById('paciente_sexo').value = patientGlobal.sex.toUpperCase() === 'FEMENINO' ? 'FEMALE' : patientGlobal.sex.toUpperCase() === 'MASCULINO' ? 'MALE' : 'OTHER';

    hidePopup();
}

function closePopupPersona() {
    document.getElementById('patientList').value = "";
    document.getElementById('patientId').value = "";
    document.getElementById('paciente_nombre').value = "";
    document.getElementById('paciente_apellido').value = "";
    document.getElementById('paciente_fecha_nacimiento').value = "";
    document.getElementById('paciente_obra_social').value = "";
    document.getElementById('paciente_plan').value = "";
    document.getElementById('paciente_sexo').value  = "";
  hidePopup();
}

function resetPatientList() {
  var patientList = document.getElementById('patientList');
  if (patientList) {
      patientList.selectedIndex = 0;
      for (let i = patientList.options.length - 1; i > 0; i--) {
          patientList.remove(i);
      }
  }
}
