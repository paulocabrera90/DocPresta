document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
      event.preventDefault();
      var email = document.getElementById("login").value;
      var password = document.getElementById("password").value;
      var formData = {
        email: email,
        password: password
      };
      const url = "http://localhost:4200/api/authorization/login";
     
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        } 
        return response.json();
      }).then(data => {
        localStorage.setItem('tokenSession', data.userData.tokenSession);      
        redirectToHomePage(data.userData.tokenSession)
    })
      .catch(error => {
        console.error("Error al iniciar sesión:", error.message);
        // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error al usuario
      });
    });
    
  });
  

function redirectToHomePage(tokenSession) {
    fetch('http://localhost:4200/api/home', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenSession}`
      }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        // Redirigir al usuario a la página de inicio
        console.log("LLego api/home")
        const url = `http://localhost:4200/api/home?token=${tokenSession}`;
        window.location.href = url;
    }).catch(error => {
        console.error("Error al redirigir al usuario:", error.message);
        // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error al usuario
    });
}