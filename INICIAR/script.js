// Mostrar u ocultar la contraseña
const passwordField = document.querySelector("#password");
const eyeIcon = document.querySelector(".eye-icon");

eyeIcon.addEventListener("click", () => {
    const isPassword = passwordField.getAttribute("type") === "password";
    passwordField.setAttribute("type", isPassword ? "text" : "password");
    eyeIcon.classList.toggle("bx-show");
    eyeIcon.classList.toggle("bx-hide");
});

// Manejador del formulario de inicio de sesión
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    // Lógica de autenticación o validación
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        alert("Inicio de sesión exitoso.");
        // Redirigir a otra página o realizar acciones
    } else {
        document.getElementById("error-message").textContent = "Por favor, completa ambos campos.";
    }
});
