document.addEventListener('DOMContentLoaded', function() {   

    const addButton = document.getElementById('addConcentration');
    const list = document.getElementById('concentrationList');
    const checkActiveCheckbox = document.getElementById('checkActive');
    const checkActiveHidden = document.getElementById('checkActiveHidden');

    let itemData = {};

    if (list.children.length === 0) {
        document.querySelector('.selected-concentrations').style.display = 'none';
    }

    checkActiveCheckbox.addEventListener('change', function() {        
        if (checkActiveCheckbox.checked) {
            checkActiveHidden.disabled = true;
        } else {            
            checkActiveHidden.disabled = false;
        }
    });

    addButton.addEventListener('click', function() {
        const pharmaFormListElement = document.getElementById('pharmaFormList');
        const quantityMedListElement = document.getElementById('quantityMedList');
        const quantityId = document.getElementById('concentratedMedicineQuantityId').value;
        const magnitude = document.getElementById('concentratedMedicineMagnitude').value;
        const pharmaTypeId = document.getElementById('pharmaFormList').value;
        const pharmaFormListText = pharmaFormListElement.options[pharmaFormListElement.selectedIndex].text;
        const quantityMedListText = quantityMedListElement.options[quantityMedListElement.selectedIndex].text;
        const quantityMedList = document.getElementById('quantityMedList').value;
        const comercialName = document.getElementById('comercialName').value;
        const familyMedicineName = document.getElementById('familyMedicineName').value;

        if (list.children.length === 0) {
            document.querySelector('.selected-concentrations').style.display = 'none';
        }else {
            document.querySelector('.selected-concentrations').style.display = 'block';
        }

        if (quantityId && magnitude && pharmaFormListText && quantityMedListText && comercialName && familyMedicineName) {
            document.querySelector('.selected-concentrations').style.display = 'block';
            addNewItem(quantityId, magnitude, pharmaFormListText, quantityMedListText, comercialName, familyMedicineName);            
            updateItemsInput();            
        }else{
            alert("Todos los campos de Propiedades del medicamento, son obligatorios")
        }
    });

    function addNewItem(quantityId, magnitude, pharmaTypeId, quantityMedList, comercialName, familyMedicineName) {

        document.querySelector('.selected-concentrations').style.display = 'block';
        
        const li = document.createElement('li');
        li.setAttribute('data-quantity-id', quantityId);
        li.setAttribute('data-magnitude', magnitude);
        li.setAttribute('data-pharma-type-id', pharmaTypeId);
        li.setAttribute('data-quantity-med-list', quantityMedList);
        li.setAttribute('data-comercial-name', comercialName);
        li.setAttribute('data-family-medicine-name', familyMedicineName);
        li.textContent = `Concentración: ${quantityId}${magnitude}, Cantidades/Unidades: ${quantityMedList}, Forma Farmacéutica: ${pharmaTypeId}, Familia Farmacéutica: ${familyMedicineName}, Nombre Comercial: ${comercialName}`;
        
        if (isAlreadyInList(li.textContent)) {
                alert("Este elemento ya ha sido añadido.");
                return;
        }
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-item');
        removeBtn.textContent = 'Eliminar';
        removeBtn.onclick = function() {
            this.parentNode.remove();
            if (list.children.length === 0) {
                document.querySelector('.selected-concentrations').style.display = 'none';
            }
            updateItemsInput();
        };
        li.appendChild(removeBtn);
    
        list.appendChild(li);
        updateItemsInput();
    }

    function updateItemsInput() {
        const items = [];
        list.querySelectorAll('li').forEach(li => {
            const item = {
                quantityId: li.getAttribute('data-quantity-id'),
                magnitude: li.getAttribute('data-magnitude'),
                pharmaTypeId: li.getAttribute('data-pharma-type-id'),
                quantityMedList: li.getAttribute('data-quantity-med-list'),
                comercialName: li.getAttribute('data-comercial-name'),
                familyMedicineName: li.getAttribute('data-family-medicine-name')
            };
            items.push(item);
        });

        if(items.length === 0){
            itemData = "";
        }else{
            itemData = JSON.stringify(items);
        }
    }

    list.addEventListener('click', function(event) {
        if (event.target.matches('.remove-item')) {
            const index = event.target.dataset.index;
            event.target.parentNode.remove();
            updateItemsInput();
        }
    });
    

    function isAlreadyInList(content) {
        const items = document.querySelectorAll('#concentrationList li');
        return Array.from(items).some(item => item.textContent.includes(content));
    }
    
    //_______________________________________________________________________________-
    //_______________________________________________________________________________-

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
             showSpinner(true); // Asegúrate de que esta función muestra un indicador de carga
    
            updateItemsInput();
            if(itemData.length === 0){
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se han añadido propiedades al medicamento.',
                    confirmButtonColor: '#3085d6',
                });
                // showSpinner(false);
                return;
            }
    
            const name = document.getElementById('name').value;
            const code = document.getElementById('code').value;
            const active = document.getElementById('checkActive').checked ? 'Activo' : 'Inactivo';
            const data = {name, code, active, items: itemData};
    
            const medicineId = form.getAttribute("data-id");
            const isUpdate = medicineId ? true : false;
            const url = isUpdate ? `/api/medicine/update/${medicineId}` : '/api/medicine/create';
            const method = isUpdate ? 'PATCH' : 'POST';
    
            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
    
                const result = await response.json();
                if (!response.ok) {
                    throw new Error('Algo salió mal en el servidor: ' + response.statusText);
                }
    
                await Swal.fire({
                    icon: 'success',
                    title: isUpdate ? 'Actualizado' : 'Creado',
                    text: isUpdate ? `Se actualizó correctamente el medicamento` : 'Se agregó correctamente el medicamento',
                    confirmButtonColor: '#3085d6',
                });
                // showSpinner(false);
                window.location.href = '/api/medicine';
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.message,
                    confirmButtonColor: '#d33',
                });
                // showSpinner(false);
            }
        });
    } else {
        console.log("No se encontró el formulario.");
    }
});
