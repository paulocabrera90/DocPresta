document.addEventListener("DOMContentLoaded", function() {
  var modal = document.getElementById('errorModal');
  var message = document.getElementById('errorMessage');

    document.getElementById("loginForm").addEventListener("submit", async function(event) {
      event.preventDefault();
      var email = document.getElementById("login").value;
      var password = document.getElementById("password").value;
      var formData = {
        email: email,
        password: password
      };
      const url = "/api/authorization/login";

      showSpinner(true);
      
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json(); 
        if (!response.ok) {
          if (data.errors && Array.isArray(data.errors)) {          
            let messages = data.errors.map(item => item.msg + " " + item.path).join(', ');
            throw new Error(messages);
          } else {
            throw new Error(data.msg);
          }
        }

        localStorage.setItem("user", JSON.stringify(data.userData));

        setTimeout(() => {
          showSpinner(false);
          window.location.href = `/api/home`;
        }, 4000);

      } catch (error) {
        showSpinner(false);
        Swal.fire('Error!', error.message, 'error');
        console.error("Error al iniciar sesión:", error.message);
    }

    });

    function showSpinner(show) {
      const overlay = document.querySelector('.loading-overlay');
      if (show) {
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
      } else {
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
      }
    }
    
});
  
