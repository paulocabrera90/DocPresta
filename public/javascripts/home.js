
function confirmDelete() {
    if (window.confirm("¿Estás seguro de que deseas eliminar este profesional?")) {
        const form = event.target.closest("form");
        const profId = form.getAttribute("data-id");
        
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
