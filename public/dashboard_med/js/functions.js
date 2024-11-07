// Función para generar un nombre aleatorio
// Función para manejar la navegación
// function manejarNavegacion() {
//     const enlaces = document.querySelectorAll("#sidebar a");
//     const secciones = document.querySelectorAll(".dashboard-section");

//     enlaces.forEach(enlace => {
//         enlace.addEventListener("click", (e) => {
//             e.preventDefault();
//             const targetId = enlace.getAttribute("href").substring(1);

//             if (targetId === "cerrar-sesion") {
//                 cerrarSesion();
//                 return;
//             }

//             enlaces.forEach(el => el.classList.remove("active"));
//             enlace.classList.add("active");

//             secciones.forEach(seccion => {
//                 if (seccion.id === targetId) {
//                     seccion.classList.add("active");
//                     // Cargar datos específicos de la sección
//                     switch(targetId) {
//                         case "citas":
//                             mostrarCitas();
//                             break;
//                         case "historias":
//                             mostrarHistoriasClinicas();
//                             break;
//                         case "cuentas":
//                             mostrarCuentas();
//                             break;
//                         case "servicios":
//                             mostrarServicios();
//                             break;
//                     }
//                 } else {
//                     seccion.classList.remove("active");
//                 }
//             });
//         });
//     });
// }

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
    
}

function mostrarHistoriasClinicas() {
    const listaHistorias = document.getElementById("lista-historias");

}

function mostrarCuentas() {
}

function mostrarServicios() {

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
    // Aquí iría la lógica real para cerrar sesión,     como limpiar el almacenamiento local y redirigir a la página de inicio de sesión
}

// Función para inicializar la aplicación
function inicializarApp() {
    // manejarNavegacion();
    manejarHamburgerMenu();
    manejarNotificaciones();
    // Mostrar la sección de calendario por defecto
    // document.getElementById("calendario").classList.add("active");
}

// Función para manejar la navegación móvil
function handleMobileNavigation() {
    const mobileHamburger = document.querySelector('.mobile-nav-icons .fa-bars').parentElement;
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const mobileSidebarClose = document.querySelector('.mobile-sidebar-close');

    mobileHamburger.addEventListener('click', (e) => {
        e.preventDefault();
        mobileSidebar.classList.add('open');
    });

    mobileSidebarClose.addEventListener('click', () => {
        mobileSidebar.classList.remove('open');
    });

    // Cerrar el sidebar móvil al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mobileSidebar.contains(e.target) && !mobileHamburger.contains(e.target) && mobileSidebar.classList.contains('open')) {
            mobileSidebar.classList.remove('open');
        }
    });
}

// Ejecutar funciones al cargar la página
window.onload = inicializarApp;
const daysContainer = document.querySelector(".days"),
nextBtn = document.querySelector(".next-btn"),
prevBtn = document.querySelector(".prev-btn"),
month = document.querySelector(".month"),
todayBtn= document.querySelector(".today-btn");


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

//get current date
const date = new Date();
//get current month
let currentMonth = date.getMonth();
//get current year
let currentYear = date.getFullYear();

//function to render days
function renderCalendar(){


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

    for(let x= firstDay.getDay(); x > 0; x--){
        days += `<div class="day prev">${prevLastDayDate -x + 1}</div>`
    }


    for (let i = 1; i<=lastDayDate; i++){
        if(
            i=== new Date().getDate() &&
            currentMonth == new Date().getMonth() &&
            currentYear == new Date().getFullYear()
        ){
            days += `<div class="day today">${i}</div>`
        }else{
            days += `<div class="day">${i}</div>`
        }
    }

    for (let j = 1; j<=nextDays; j++){
        days += `<div class="day next">${j}</div>`;
    }


    hideTodayBtn();
    daysContainer.innerHTML=days;



}

renderCalendar();

nextBtn.addEventListener("click", ()=>{
    currentMonth++;
    if(currentMonth > 11){
       currentMonth = 0;
       currentYear++;
    }
    renderCalendar();
})

prevBtn.addEventListener("click", ()=>{
    currentMonth--;
    if(currentMonth < 0){
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

todayBtn.addEventListener("click",() =>{
    currentMonth = date.getMonth();
    currentYear=date.getFullYear();

    renderCalendar();
})

function hideTodayBtn(){
    if(
        currentMonth === new Date ().getMonth()&&
        currentYear === new Date().getFullYear()
    ){
        todayBtn.style.display = "none";
    } else{
        todayBtn.style.display = "flex";
    }
}

let servicios = [
    { id: 1, nombre: "Consulta General", tipo: "Consulta", costo: 50, tiempoProcedimiento: "30 minutos", tiempoRecuperacion: "Inmediato" },
    { id: 2, nombre: "Biopsias", tipo: "Cirugía", costo: 200, tiempoProcedimiento: "30 minutos", tiempoRecuperacion: "5 días" },
   
];

// Elementos del DOM
const tablaServicios = document.getElementById('tablaServicios');
const btnAgregarServicio = document.getElementById('btnAgregarServicio');
const modal = document.getElementById('modalServicio');
const closeModal = document.querySelector('.close');
const formServicio = document.getElementById('formServicio');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');

// Función para renderizar la tabla de servicios
function renderizarTabla(serviciosArray) {
    tablaServicios.innerHTML = '';
    serviciosArray.forEach(servicio => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${servicio.nombre}</td>
            <td>${servicio.tipo}</td>
            <td>S/. ${servicio.costo}</td>
            <td>${servicio.tiempoProcedimiento}</td>
            <td>${servicio.tiempoRecuperacion}</td>
            <td>
                <button class="edit-button" data-id="${servicio.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-button" data-id="${servicio.id}">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
            </td>
        `;
        tablaServicios.appendChild(row);
    });
}

// Inicializar la tabla
renderizarTabla(servicios);

// Evento para abrir el modal de agregar servicio
btnAgregarServicio.addEventListener('click', () => {
    modalTitle.textContent = 'Añadir Servicio';
    formServicio.reset();
    modal.classList.add('show');
});

// Evento para cerrar el modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
});

// Evento para manejar el envío del formulario
formServicio.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formServicio);
    const nuevoServicio = {
        id: Date.now(), // Generar un ID único
        nombre: formData.get('nombre'),
        tipo: formData.get('tipoProcedimiento'),
        costo: parseFloat(formData.get('costo')),
        tiempoProcedimiento: formData.get('tiempoEstimadoProcedimiento'),
        tiempoRecuperacion: formData.get('tiempoEstimadoRecuperacion')
    };

    if (formServicio.dataset.editId) {
        // Editar servicio existente
        const index = servicios.findIndex(s => s.id === parseInt(formServicio.dataset.editId));
        if (index !== -1) {
            servicios[index] = { ...servicios[index], ...nuevoServicio };
        }
        delete formServicio.dataset.editId;
    } else {
        // Agregar nuevo servicio
        servicios.push(nuevoServicio);
    }

    renderizarTabla(servicios);
    modal.classList.remove('show');
});

// Evento para editar o eliminar servicios
tablaServicios.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-button') || e.target.closest('.edit-button')) {
        const id = parseInt(e.target.dataset.id || e.target.closest('.edit-button').dataset.id);
        const servicio = servicios.find(s => s.id === id);
        if (servicio) {
            modalTitle.textContent = 'Editar Servicio';
            formServicio.nombre.value = servicio.nombre;
            formServicio.tipoProcedimiento.value = servicio.tipo;
            formServicio.costo.value = servicio.costo;
            formServicio.tiempoEstimadoProcedimiento.value = servicio.tiempoProcedimiento;
            formServicio.tiempoEstimadoRecuperacion.value = servicio.tiempoRecuperacion;
            formServicio.dataset.editId = id;
            modal.classList.add('show');
        }
    } else if (e.target.classList.contains('delete-button') || e.target.closest('.delete-button')) {
        const id = parseInt(e.target.dataset.id || e.target.closest('.delete-button').dataset.id);
        if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            servicios = servicios.filter(s => s.id !== id);
            renderizarTabla(servicios);
        }
    }
});

// Evento para buscar servicios
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const serviciosFiltrados = servicios.filter(servicio => 
        servicio.nombre.toLowerCase().includes(searchTerm) ||
        servicio.tipo.toLowerCase().includes(searchTerm)
    );
    renderizarTabla(serviciosFiltrados);
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});