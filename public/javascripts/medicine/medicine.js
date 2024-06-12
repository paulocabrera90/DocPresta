document.addEventListener('DOMContentLoaded', function() {   

    const addButton = document.getElementById('addConcentration');
    const list = document.getElementById('concentrationList');

    if (list.children.length === 0) {
        document.querySelector('.selected-concentrations').style.display = 'none';
    }

    addButton.addEventListener('click', function() {

        const quantityId = Array.from(document.getElementById('concentratedMedicineQuantityId').selectedOptions).map(opt => opt.value).join(', ');
        const quantityText = Array.from(document.getElementById('concentratedMedicineQuantityId').selectedOptions).map(opt => opt.text).join(', ');

        const checkActive = document.getElementById('checkActive').checked;
        const checkActiveText = checkActive?'Activo':'Inactivo';

        const magnitude = document.getElementById('concentratedMedicineMagnitude').options[document.getElementById('concentratedMedicineMagnitude').selectedIndex].text;
        
        const pharmaFormId = Array.from(document.getElementById('pharmaFormList').selectedOptions).map(opt => opt.value).join(', ');
        const pharmaFormText = Array.from(document.getElementById('pharmaFormList').selectedOptions).map(opt => opt.text).join(', ');

        const quantityMedList = Array.from(document.getElementById('quantityMedList').selectedOptions).map(opt => opt.value).join(', ');
        const quantityMedListText = Array.from(document.getElementById('quantityMedList').selectedOptions).map(opt => opt.text).join(', ');

        if (list.children.length === 0) {
            document.querySelector('.selected-concentrations').style.display = 'none';
        }

        if (quantityId && magnitude && pharmaFormId && quantityMedList) {
            const content = `Concentración: ${quantityText}${magnitude}, Forma Farmacéutica: ${pharmaFormText}, Cantidades/Unidades: ${quantityMedListText}, ${checkActiveText}`;
            document.querySelector('.selected-concentrations').style.display = 'block';

            if (isAlreadyInList(content)) {
                alert("Este elemento ya ha sido añadido.");
                return;
            }

            const li = document.createElement('li');
            li.textContent = content;

            const removeBtn = document.createElement('button-remove-medicine-list');
            removeBtn.textContent = 'Eliminar';
            removeBtn.onclick = function() {
                this.parentNode.remove();
                if (list.children.length === 0) {
                    document.querySelector('.selected-concentrations').style.display = 'none';
                } else {
                    document.querySelector('.selected-concentrations').style.display = 'block';
                }
            };
            li.appendChild(removeBtn);
            document.getElementById('concentrationList').appendChild(li);

            // Agregar inputs ocultos al formulario para enviar los datos
            addHiddenInput(form, 'concentratedMedicineQuantityId[]', quantityId);
            addHiddenInput(form, 'concentratedMedicineMagnitude[]', magnitude);
            addHiddenInput(form, 'pharmaFormId[]', pharmaFormId);
            addHiddenInput(form, 'quantityMedList[]', quantityMedList);
        }else{
            alert("Todos los campos son obligatorios")
        }me
    });

    function addHiddenInput(form, name, value) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    function isAlreadyInList(content) {
        const items = document.querySelectorAll('#concentrationList li');
        return Array.from(items).some(item => item.textContent.includes(content));
    }
    
    //_______________________________________________________________________________-
    //_______________________________________________________________________________-

    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const patientId = form.getAttribute("data-id");

        const isUpdate = patientId? true : false;
        const url = isUpdate ? `/api/medicine/update/${patientId}` : '/api/medicine/create';
        const method = isUpdate ? 'PATCH' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                // Include other necessary headers, e.g., authorization
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            const message = isUpdate ? `Se actualizo correctamente el Medicamento` : 'Se agrego correctamente el Medicamento';
            alert(message);
            window.location.href = '/api/medicine';
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
            alert('Ocurrio un error. Intente nuevamente.');
        });
    });
    
});
