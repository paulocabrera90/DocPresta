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
        const comercialName = document.getElementById('comercialName').value;
        const magnitude = document.getElementById('concentratedMedicineMagnitude').options[document.getElementById('concentratedMedicineMagnitude').selectedIndex].text;
        const familyMedicineName = document.getElementById('familyMedicineName').value;
        const pharmaFormId = Array.from(document.getElementById('pharmaFormList').selectedOptions).map(opt => opt.value).join(', ');
        const pharmaFormText = Array.from(document.getElementById('pharmaFormList').selectedOptions).map(opt => opt.text).join(', ');
        const quantityMedList = Array.from(document.getElementById('quantityMedList').selectedOptions).map(opt => opt.value).join(', ');
        const quantityMedListText = Array.from(document.getElementById('quantityMedList').selectedOptions).map(opt => opt.text).join(', ');

        if (list.children.length === 0) {
            document.querySelector('.selected-concentrations').style.display = 'none';
        }

        if (quantityId && magnitude && pharmaFormId && quantityMedList) {
            const content = `Concentración: ${quantityText}${magnitude}, Forma Farmacéutica: ${pharmaFormText}, Cantidades/Unidades: ${quantityMedListText}, Nombre Comercial: ${comercialName}, Familia Farmacéutica: ${familyMedicineName}, ${checkActiveText}`;
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
                }
            };
            li.appendChild(removeBtn);
            list.appendChild(li);
    
            addListItemToForm(quantityId, magnitude, pharmaFormId, quantityMedList, comercialName, familyMedicineName);

        }else{
            alert("Todos los campos son obligatorios")
        }me
    });

    function addListItemToForm(quantityId, magnitude, pharmaFormId, quantityMedList, comercialName, familyMedicineName) {
        let input = form.querySelector('input[name="items"]');
        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'items';
            form.appendChild(input);
        }
        
        // Obtiene el valor actual del input, que es un JSON, y lo convierte a un arreglo
        let items = input.value ? JSON.parse(input.value) : [];
        
        // Añade el nuevo ítem al arreglo
        items.push({
            quantityId: quantityId,
            magnitude: magnitude,
            pharmaTypeId: pharmaFormId,
            quantityMedList: quantityMedList,
            comercialName: comercialName,
            familyMedicineName: familyMedicineName
        });

        // Guarda el arreglo actualizado de nuevo en el input como string JSON
        input.value = JSON.stringify(items);
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
