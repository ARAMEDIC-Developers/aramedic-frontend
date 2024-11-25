const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const keyFile = path.join(__dirname, 'calendario-442806-a679283718b4.json');

// Verificar si el archivo de credenciales existe
if (!fs.existsSync(keyFile)) {
    console.log('El archivo de credenciales no se encuentra');
} else {
    console.log('Archivo de credenciales encontrado');
}

// Cargar las credenciales manualmente
const key = require(keyFile);

// Crear un cliente OAuth2 a partir de las credenciales de la cuenta de servicio
const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

console.log('Configuración de autenticación:', auth);

const calendar = google.calendar({ version: 'v3', auth });

// Función para obtener los eventos
async function obtenerEventosCalendario() {
    try {
        const response = await calendar.events.list({
            calendarId: '202010603@urp.edu.pe', // Cambia por el ID de tu calendario
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

obtenerEventosCalendario()
    .then(eventos => {
        console.log('Eventos obtenidos:', eventos);
    })
    .catch(error => {
        console.error('Error:', error);
    });
