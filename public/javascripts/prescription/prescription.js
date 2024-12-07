document.addEventListener("DOMContentLoaded", function() {
  const inputField = document.getElementById('prestaciones-dni');
  const dataList = document.getElementById('patientList');
  const patientsData = JSON.parse(document.getElementById('patientsData').value);

    patientsData.forEach(patient => {
      const option = new Option(`${patient.User.Person.firstName} ${patient.User.Person.lastName} - ${patient.User.Person.numberDocument}`);
      dataList.add(option);
    });
        
    let patientGlobal = {};
    
      dataList.addEventListener("change", function() {
        const selectedValue = this.value;
        const patient = patientsData.find(p => `${p.User.Person.firstName} ${p.User.Person.lastName} - ${p.User.Person.numberDocument}` === selectedValue);
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
      <p>Nombre: ${data.User.Person.firstName} ${data.User.Person.lastName}</p>
      <p>Email: ${data.User.email}</p>
      <p>DNI: ${data.User.Person.numberDocument}</p>
      <p>Fecha de nacimiento: ${data.User.Person.birthDate}</p>
      <p>Tipo de documento: ${data.User.Person.typeDocument}</p>
      <p>Sexo: ${data.User.Person.sex}</p>
      <p>Rol: ${data.User.rol}</p>
      <p>Obra Social: ${data.PlanOS.SocialWork.name}</p>
      <p>Plan de Obra Social: ${data.PlanOS.name}</p>
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

    document.getElementById('paciente_nombre').value = patientGlobal.User.Person.firstName;
    document.getElementById('paciente_apellido').value = patientGlobal.User.Person.lastName;
    document.getElementById('paciente_fecha_nacimiento').value = new Date(patientGlobal.User.Person.birthDate).toISOString().split('T')[0];
    document.getElementById('paciente_obra_social').value = patientGlobal.PlanOS.SocialWork.name;
    document.getElementById('paciente_plan').value = patientGlobal.PlanOS.name;
    document.getElementById('paciente_sexo').value = patientGlobal.User.Person.sex.toUpperCase() === 'FEMENINO' ? 'FEMALE' : patientGlobal.User.Person.sex.toUpperCase() === 'MASCULINO' ? 'MALE' : 'OTHER';

    hidePopup();
}

function closePopup() {
  var overlay = document.getElementById('overlayPrestacion');
  var popup = document.querySelector('.popupPres');
  if (overlay && popup) {
      overlay.style.display = 'none';
      popup.style.display = 'none';
      resetPatientList();
  } else {
      console.log("No se pudo cerrar el popup porque los elementos no fueron encontrados.");
  }
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
