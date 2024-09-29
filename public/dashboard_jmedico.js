// Función para generar un nombre aleatorio
function generarNombreAleatorio() {
    const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofía', 'Miguel', 'Elena'];
    const apellidos = ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Romero', 'Fernández', 'Torres'];
    
    const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
    const apellidoAleatorio = apellidos[Math.floor(Math.random() * apellidos.length)];
    
    return `${nombreAleatorio} ${apellidoAleatorio}`;
}

// Función para obtener un avatar aleatorio
function obtenerAvatarAleatorio() {
    const avatares = [
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar1-Rl9Wd8Yl8Iy5Uy9Uy0Uy1Uy2Uy3.png',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar2-Rl9Wd8Yl8Iy5Uy9Uy0Uy1Uy2Uy4.png',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar3-Rl9Wd8Yl8Iy5Uy9Uy0Uy1Uy2Uy5.png',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar4-Rl9Wd8Yl8Iy5Uy9Uy0Uy1Uy2Uy6.png'
    ];
    
    return avatares[Math.floor(Math.random() * avatares.length)];
}

// Función para actualizar el perfil de usuario
function actualizarPerfilUsuario() {
    const userProfileElement = document.getElementById('user-profile');
    const nombreUsuario = generarNombreAleatorio();
    const avatarUrl = obtenerAvatarAleatorio();
    
    userProfileElement.innerHTML = `
        <img src="${avatarUrl}" alt="Avatar de usuario" class="profile-image">
        <span class="user-name">${nombreUsuario}</span>
    `;
}

// Función para manejar la navegación
function manejarNavegacion() {
    const enlaces = document.querySelectorAll("#sidebar a");
    const secciones = document.querySelectorAll(".dashboard-section");

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = enlace.getAttribute("href").substring(1);

            if (targetId === "cerrar-sesion") {
                cerrarSesion();
                return;
            }

            enlaces.forEach(el => el.classList.remove("active"));
            enlace.classList.add("active");

            secciones.forEach(seccion => {
                if (seccion.id === targetId) {
                    seccion.classList.add("active");
                    // Cargar datos específicos de la sección
                    switch(targetId) {
                        case "citas":
                            mostrarCitas();
                            break;
                        case "historias":
                            mostrarHistoriasClinicas();
                            break;
                        case "cuentas":
                            mostrarCuentas();
                            break;
                        case "servicios":
                            mostrarServicios();
                            break;
                    }
                } else {
                    seccion.classList.remove("active");
                }
            });
        });
    });
}

// Función para manejar el menú hamburguesa
function manejarHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    hamburgerMenu.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('compressed');
        mainContent.classList.toggle('expanded');
    });
}

// Función para manejar las notificaciones
function manejarNotificaciones() {
    const notificationBell = document.querySelector('.notification-bell');
    const notificationsPanel = document.getElementById('notifications-panel');

    notificationBell.addEventListener('click', (e) => {
        e.preventDefault();
        notificationsPanel.style.display = notificationsPanel.style.display === 'block' ? 'none' : 'block';
    });

    // Cerrar el panel de notificaciones al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (!notificationsPanel.contains(e.target) && !notificationBell.contains(e.target)) {
            notificationsPanel.style.display = 'none';
        }
    });
}

// Funciones para mostrar datos en el DOM (simuladas)
function mostrarCitas() {
    const listaCitas = document.getElementById("lista-citas");
    listaCitas.innerHTML = `
        <div class="cita-card">
            <h3>Juan Pérez</h3>
            <p><strong>Fecha:</strong> 2024-09-05</p>
            <p><strong>Hora:</strong> 10:00 AM</p>
            <button class="btn-primary" onclick="mostrarDetallesCita(1)">Ver Detalles</button>
        </div>
        <div class="cita-card">
            <h3>Ana Gómez</h3>
            <p><strong>Fecha:</strong> 2024-09-05</p>
            <p><strong>Hora:</strong> 11:00 AM</p>
            <button class="btn-primary" onclick="mostrarDetallesCita(2)">Ver Detalles</button>
        </div>
    `;
}

function mostrarHistoriasClinicas() {
    const listaHistorias = document.getElementById("lista-historias");
    listaHistorias.innerHTML = `
        <div class="historia-card">
            <h3>Juan Pérez</h3>
            <p><strong>Fecha de Creación:</strong> 2024-01-15</p>
            <p><strong>Última Actualización:</strong> 2024-09-01</p>
            <button class="btn-primary" onclick="verHistoriaClinica(1)">Ver Historia</button>
        </div>
        <div class="historia-card">
            <h3>Ana Gómez</h3>
            <p><strong>Fecha de Creación:</strong> 2024-02-20</p>
            <p><strong>Última Actualización:</strong> 2024-08-15</p>
            <button class="btn-primary" onclick="verHistoriaClinica(2)">Ver Historia</button>
        </div>
    `;
}

function mostrarCuentas() {
    const listaCuentas = document.getElementById("lista-cuentas");
    listaCuentas.innerHTML = `
        <div class="cuenta-card">
            <h3>Dr. Fernando Sánchez</h3>
            <p><strong>Rol:</strong> Médico</p>
            <button class="btn-primary" onclick="editarCuenta(1)">Editar</button>
        </div>
        <div class="cuenta-card">
            <h3>Enfermera García</h3>
            <p><strong>Rol:</strong> Enfermera</p>
            <button class="btn-primary" onclick="editarCuenta(2)">Editar</button>
        </div>
    `;
}

function mostrarServicios() {
    const listaServicios = document.getElementById("lista-servicios");
    listaServicios.innerHTML = `
        <div class="servicio-card">
            <h3>Consulta General</h3>
            <p><strong>Duración:</strong> 30 min</p>
            <p><strong>Precio:</strong> $50</p>
            <button class="btn-primary" onclick="editarServicio(1)">Editar</button>
        </div>
        <div class="servicio-card">
            <h3>Examen de Laboratorio</h3>
            <p><strong>Duración:</strong> 1 hora</p>
            <p><strong>Precio:</strong> $100</p>
            <button class="btn-primary" onclick="editarServicio(2)">Editar</button>
        </div>
    `;
}

// Funciones para manejar eventos (simuladas)
function mostrarDetallesCita(id) {
    alert(`Mostrando detalles de la cita con ID: ${id}`);
}

function verHistoriaClinica(id) {
    alert(`Mostrando historia clínica con ID: ${id}`);
}

function editarCuenta(id) {
    alert(`Editando cuenta con ID: ${id}`);
}

function editarServicio(id) {
    alert(`Editando servicio con ID: ${id}`);
}

// Función para cerrar sesión (simulada)
function cerrarSesion() {
    alert("Cerrando sesión...");
    window.location.replace("login");
    window.addEventListener('beforeunload', function() {
        this.localStorage.clear();
    })
    // Aquí iría la lógica real para cerrar sesión,     como limpiar el almacenamiento local y redirigir a la página de inicio de sesión
}

// Función para inicializar la aplicación
function inicializarApp() {
    actualizarPerfilUsuario();
    manejarNavegacion();
    manejarHamburgerMenu();
    manejarNotificaciones();
    // Mostrar la sección de calendario por defecto
    document.getElementById("calendario").classList.add("active");
}

// Ejecutar funciones al cargar la página
window.onload = inicializarApp;