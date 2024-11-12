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
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.getElementById('sidebar');

    hamburgerMenu.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('active');
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
    req.session.destroy();
    res.redirect('/login');
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

const daysContainer = document.querySelector(".days"),
    nextBtn = document.querySelector(".next-btn"),
    prevBtn = document.querySelector(".prev-btn"),
    month = document.querySelector(".month"),
    todayBtn = document.querySelector(".today-btn");

const eventsContainer = document.getElementById("events-container");
const eventsList = document.getElementById("events-list");

const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

// Actualizar los eventos para que coincidan con fechas visibles en noviembre 2024
const events = [
    { id: 1, title: "Reunión de equipo", date: "2024-11-15", time: "10:00 AM", color: "#3498db" },
    { id: 2, title: "Entrega del proyecto", date: "2024-11-20", time: "02:00 PM", color: "#e74c3c" },
    { id: 3, title: "Fiesta de cumpleaños", date: "2024-11-25", time: "07:00 PM", color: "#2ecc71" }
];

//get current date
const date = new Date();
//get current month
let currentMonth = date.getMonth();
//get current year
let currentYear = date.getFullYear();

//function to render days
function renderCalendar() {
    date.setDate(1);
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const lastDayIndex = lastDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    const prevLastDayDate = prevLastDay.getDate();
    const nextDays = 7 - lastDayIndex - 1;

    month.innerHTML = `${months[currentMonth]} ${currentYear}`;
    let days = "";

    for (let x = firstDay.getDay(); x > 0; x--) {
        days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDayDate; i++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.date === dateStr);
        const hasEvents = dayEvents.length > 0;
        
        let className = "day";
        if (
            i === new Date().getDate() &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear()
        ) {
            className += " today";
        }
        if (hasEvents) {
            className += " has-events";
        }

        days += `
            <div class="${className}" data-date="${dateStr}">
                ${i}
                ${renderEventIndicators(dayEvents)}
            </div>`;
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next">${j}</div>`;
    }

    hideTodayBtn();
    daysContainer.innerHTML = days;
    addEventListeners();
    
    // Mostrar eventos del día actual al cargar
    const today = new Date();
    if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        const todayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        showEvents(todayStr);
    }
}

function renderEventIndicators(events) {
    if (events.length === 0) return '';
    return `<div class="event-indicators">${events.map(event => `<span class="event-indicator" style="background-color: ${event.color};"></span>`).join('')}</div>`;
}

function addEventListeners() {
    const dayElements = document.querySelectorAll('.day:not(.prev):not(.next)');
    dayElements.forEach(day => {
        day.addEventListener('click', () => showEvents(day.dataset.date));
    });
}

function showEvents(date) {
    const dayEvents = events.filter(event => event.date === date);
    eventsList.innerHTML = '';
    
    if (dayEvents.length > 0) {
        dayEvents.forEach(event => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="event-item">
                    <span class="event-color" style="background-color: ${event.color};"></span>
                    <div class="event-details">
                        <strong>${event.title}</strong>
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>`;
            eventsList.appendChild(li);
        });
        eventsContainer.style.display = 'block';
    } else {
        const li = document.createElement('li');
        li.innerHTML = '<div class="no-events">No hay eventos para este día</div>';
        eventsList.appendChild(li);
        eventsContainer.style.display = 'block';
    }
}

renderCalendar();

nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
})

prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

todayBtn.addEventListener("click", () => {
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();

    renderCalendar();
})

function hideTodayBtn() {
    if (
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()
    ) {
        todayBtn.style.display = "none";
    } else {
        todayBtn.style.display = "flex";
    }
}

// Agregar estilos CSS adicionales
const style = document.createElement('style');
style.textContent = `
    .has-events {
        font-weight: bold;
        border: 2px solid var(--accent-color);
    }
    
    .event-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .event-details {
        display: flex;
        flex-direction: column;
    }
    
    .event-time {
        font-size: 0.85em;
        color: #666;
    }
    
    .no-events {
        text-align: center;
        color: #666;
        padding: 10px;
    }
`;
document.head.appendChild(style);

//funciones para crud servicios
