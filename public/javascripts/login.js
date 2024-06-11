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
          setTimeout(() => {
            window.location.href = `http://localhost:4200/api/home`;
          }, 3000);
     })
      .catch(error => {
        console.error("Error al iniciar sesión:", error.message);
        // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error al usuario
      });
    });
    
  });
  