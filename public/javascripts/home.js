
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