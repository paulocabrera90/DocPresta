document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
      event.preventDefault();
      var email = document.getElementById("login").value;
      var password = document.getElementById("password").value;
      var formData = {
        email: email,
        password: password
      };
      const url = "/api/authorization/login";
     
      // Mostrar el spinner y bloquear la pantalla
      showSpinner(true);

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
              showSpinner(false);
             window.location.href = `/api/home`;
           }, 3000);
     })
      .catch(error => {
        console.error("Error al iniciar sesión:", error.message);
      });
    });

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
    
});
  
