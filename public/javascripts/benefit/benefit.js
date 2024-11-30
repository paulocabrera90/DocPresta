document.addEventListener('DOMContentLoaded', function() {
   

    //_______________________________________________________________________________-
    const form = document.querySelector('form');
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
            }).then(result => {
                console.log('Success:', result);
                const message = isUpdate ? `Se actualizo correctamente la prescripción` : 'Se agrego correctamente la prescripción';
                alert(message);
                console.log("Redirigiendo...");
                showSpinner(false)
                window.location.href = '/api/benefit';
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                alert('Ocurrio un error. Intente nuevamente.');
            });
        });
    }else {
        console.log("No se encontró el formulario.");
    }    
    
});
