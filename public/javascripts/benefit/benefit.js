document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('button-addPrestacion').addEventListener('click', function() {
        fetch('/api/benefit/form')
            .then(response => response.text())
            .then(html => {
                document.getElementById('popupContent').innerHTML = html; // Asegúrate de tener un div con id="popupContent" en tu popup
                document.getElementById('overlayPrestacion').style.display = 'flex';
            })
            .catch(error => console.error('Error loading form:', error));
    });
    
   
    const form = document.getElementById('form-benefit');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            showSpinner(true);
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const benefitId = form.getAttribute("data-id");
    
            
            const isUpdate = benefitId? true : false;
            const url = isUpdate ? `/api/benefit/update/${benefitId}` : '/api/benefit/create';
            const method = isUpdate ? 'PATCH' : 'POST';
            console.log('Creating or Updating benefit:', url);
    
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log("Response status: ", response.status);
                if (response.ok) {
                    return response.json();  
                } else {
                   
                    throw new Error('Algo salió mal en el servidor: ' + response.statusText);
                }
            }).then(async result => {
                console.log('Success:', result);
                await Swal.fire({
                    icon: 'success',
                    title: isUpdate ? 'Actualizado' : 'Creado',
                    text: isUpdate ? `Se actualizó correctamente la prescripcion` : 'Se agregó correctamente la prescripcion',
                    confirmButtonColor: '#3085d6',
                });

                console.log("Redirigiendo...");
                showSpinner(false)
                window.location.href = '/api/benefit';
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                showAlert('Error', error.message, 'error');
            });
        });
    }else {
        console.log("No se encontró el formulario.");        
    }    
    
});
