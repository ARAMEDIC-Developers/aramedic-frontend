const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const keyFile = path.join(__dirname, 'calendario-442806-a679283718b4.json');

// Verificar si el archivo de credenciales existe
if (!fs.existsSync(keyFile)) {
    console.log('El archivo de credenciales no se encuentra');
    process.exit(1); // Detener la ejecución si no se encuentra el archivo
} else {
    console.log('Archivo de credenciales encontrado');
}

// Cargar las credenciales manualmente
let key;
try {
    key = require(keyFile);
} catch (error) {
    console.error('Error al cargar el archivo de credenciales:', error);
    process.exit(1);
}

// Crear un cliente de autenticación a partir de las credenciales de la cuenta de servicio
const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

// Crear una instancia de la API de Google Calendar
const calendar = google.calendar({ version: 'v3', auth });

// Verificar que el objeto 'calendar' esté correctamente inicializado
console.log('Objeto calendar:', calendar);

async function obtenerEventosCalendario() {
    try {
        // Asegúrate de que el cliente esté correctamente autorizado
        console.log('Autenticando con Google Calendar...');
        
        // Verifica si el cliente de autenticación es válido
        const authClient = await auth.getClient();
        console.log('Autenticación exitosa:', authClient ? 'Sí' : 'No');

        const response = await calendar.events.list({
            calendarId: '202010603@urp.edu.pe', // ID del calendario
            timeMin: new Date().toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: 'startTime',
        });

        if (response.data.items && response.data.items.length > 0) {
            console.log('Eventos encontrados:', response.data.items);
            return response.data.items;
        } else {
            console.log('No se encontraron eventos.');
            return [];
        }
    } catch (error) {
        console.error('Error al obtener eventos: ', error);
        throw error;
    }
}

// Probar la función de obtención de eventos
obtenerEventosCalendario()
    .then(eventos => {
        console.log('Eventos obtenidos:', eventos);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Exportar la instancia del calendario para usar en otras partes de la aplicación
module.exports = {
    auth,
    calendar,
};
