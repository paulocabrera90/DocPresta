
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('.sidenav a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            showSpinner(true); // Mostrar el spinner
            setTimeout(() => {
                window.location.href = this.href; // Cambiar la página después de un breve retraso
            }, 1000);  // Este retraso es opcional y puede ser más corto
        });
    });

    //______________________
    var userDataString = localStorage.getItem('user');
    var userData = null;
    if (userDataString) {
        try {
            userData = JSON.parse(userDataString);
        } catch (error) {
            console.error('Error parsing userData:', error);
        }
    }

    if (userData) {
        var sidenav = document.querySelector('.sidenav');
        var welcomeText = document.createElement('h4');
        welcomeText.textContent = `Bienvenido: ${userData.fullName}`;
        sidenav.appendChild(welcomeText);

        var linksList = [];

        if (userData.rol === 'ADMIN') {
            linksList = [
                { href: "/api/home", id: "lista-prescripcion-sidenav", text: "Prescripciones" },
                { href: "#", id: "prestaciones-sidenav", text: "Prestaciones" },
                { href: "/api/medicine", id: "medicamentos-sidenav", text: "Medicamentos" },
                { href: "/api/profesional", id: "profesionales-sidenav", text: "Profesionales" },
                { href: "/api/patient", id: "pacientes-sidenav", text: "Pacientes" }
            ];
        } else if (userData.rol === 'PACIENTE') {
            linksList = [
                { href: "/api/home", id: "lista-prescripcion-sidenav", text: "Prescripciones" },
                { href: "/api/perfil", id: "profesionales-sidenav", text: "Perfil" }
            ];
        } else if (userData.rol === 'PROFESIONAL') {
            linksList = [
                { href: "/api/home", id: "lista-prescripcion-sidenav", text: "Prescripciones" },
                { href: "#", id: "prestaciones-sidenav", text: "Prestaciones" },
                { href: "/api/patient", id: "pacientes-sidenav", text: "Pacientes" },
                { href: "/api/perfil", id: "profesionales-sidenav", text: "Perfil" }
            ];
        }

        linksList.forEach(function (link) {
            var a = document.createElement('a');
            a.href = link.href;
            a.id = link.id;
            a.textContent = link.text;
            sidenav.appendChild(a);
        });

        var logoutLink = document.createElement('a');
        logoutLink.href = "/api/logout";
        logoutLink.id = "perfil-sidenav";
        logoutLink.textContent = "Salir";
        sidenav.appendChild(logoutLink);
    } else {
        // Manejo cuando userData no está disponible
        console.error('userData not available');
    }

});

function confirmDelete(event) {
    event.preventDefault();

    const form = event.target.closest("form");
    const id = form.getAttribute("data-id");
    const module = form.getAttribute("data-module");
    console.log(module);
    if (window.confirm("¿Estás seguro de que deseas eliminar este " + module + "?")) {
        const url = "/api/" + module + "/" + id;
        fetch(url, {
            method: 'DELETE'
        })
            .then(async response => {
                const data = await response.json();
                console.log("data", data)
                if (!response.ok) {
                    throw new Error(data.msg);
                }
            })
            .then(data => {
                console.log(module + " eliminado con éxito");
                alert(`${module} con ID ${id} eliminado con éxito`);
                showSpinner(false);  // Asegúrate de ocultar el spinner aquí
                window.location.href = "/api/" + module + "/";
            })
            .catch(error => {
                console.error("Error al enviar la solicitud DELETE", error);
                showSpinner(false);
                message.innerText = error.message;
                modal.style.display = 'block';

                const closeBtn = document.querySelector('.close');
                closeBtn.onclick = function () {
                    modal.style.display = 'none';
                }
            });
    }
}

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

if (window.location.pathname == '/medical-record/new') {
    const medical = document.getElementById('medical-record-sidenav')
    medical.style.backgroundColor = 'blue'
}
if (window.location.pathname == '/api/home') {
    const prescripcion = document.getElementById('lista-prescripcion-sidenav')
    prescripcion.style.backgroundColor = 'blue'
}

if (window.location.pathname == '/api/profesional') {
    const profesional = document.getElementById('profesionales-sidenav')
    profesional.style.backgroundColor = 'blue'
}

if (window.location.pathname == '/api/pacientes') {
    const pacientes = document.getElementById('pacientes-sidenav')
    pacientes.style.backgroundColor = 'blue'
}
