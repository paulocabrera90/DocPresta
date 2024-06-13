
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.sidenav a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSpinner(true); // Mostrar el spinner
            setTimeout(() => {
                window.location.href = this.href; // Cambiar la página después de un breve retraso
            }, 100);  // Este retraso es opcional y puede ser más corto
        });
    });

    function showSpinner(show) {
        const overlay = document.querySelector('.loading-overlay');
        if (show) {
          console.log("show");
          overlay.style.visibility = 'visible';
          overlay.style.opacity = '1';
        } else {
          console.log("not show");
          overlay.style.visibility = 'hidden';
          overlay.style.opacity = '0';
        }
      }
  });

function confirmDelete(event) {
    event.preventDefault();

    const form = event.target.closest("form");
    const id = form.getAttribute("data-id");
    const module = form.getAttribute("data-module");
    console.log(module);
    if (window.confirm("¿Estás seguro de que deseas eliminar este "+ module+"?")) {
        const url = "/api/" + module + "/" + id;
        fetch(url, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log(module+ " eliminado con éxito");
                alert(`${module} con ID ${id} eliminado con éxito`); 
                showSpinner(false)
                window.location.href = "/api/" + module + "/";
            } else {
                console.error("Error al eliminar el " + module);
            }
        })
        .catch(error => {
            console.error("Error al enviar la solicitud DELETE", error);
        });
    }
}

if(window.location.pathname == '/medical-record/new'){
    const medical = document.getElementById('medical-record-sidenav')
    medical.style.backgroundColor = 'blue'
}
if(window.location.pathname == '/api/home'){
    const prescripcion = document.getElementById('lista-prescripcion-sidenav')
    prescripcion.style.backgroundColor = 'blue'
}

if(window.location.pathname == '/api/profesional'){
    const profesional = document.getElementById('profesionales-sidenav')
    profesional.style.backgroundColor = 'blue'
}

if(window.location.pathname == '/api/pacientes'){
    const pacientes = document.getElementById('pacientes-sidenav')
    pacientes.style.backgroundColor = 'blue'
}
