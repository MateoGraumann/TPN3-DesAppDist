const renderizarTabla = (dispositivos) => { // Función para renderizar la tabla con los dispositivos
    const bodyTable = document.getElementById('body-table'); // Obtiene el elemento tbody de la tabla
    bodyTable.innerHTML = dispositivos.map(dispositivo => `
        <tr>
            <td>${dispositivo.id}</td>
            <td>${dispositivo.nombre}</td>
            <td>${dispositivo.ip}</td>
            <td>${dispositivo.tipo}</td>
            <td>${dispositivo.fabricante}</td>
            <td>${dispositivo.modelo}</td>
            <td>${dispositivo.estado}</td>
            <td>${dispositivo.uptime_dias}</td>
        </tr>
    `).join(''); // Mapea los dispositivos dentro de la tabla
}

async function obtenerDispositivos() {
    try {
        const response = await fetch('../db.json'); // Solicitud de datos
        if (!response.ok) throw new Error(`HTTP ${response.status}`); // Verifica si la solicitud fue exitosa
        const jsonData = await response.json(); // Convierte los datos a formato JSON
        const dispositivos = jsonData.dispositivos; // Obtiene los dispositivos del JSON
        
        renderizarTabla(dispositivos); // Renderiza la tabla con los dispositivos
    } catch (error) {
        console.error('Error:', error.message); // Maneja el error si la solicitud falla
    }
}
obtenerDispositivos(); // Llama a la función para obtener los dispositivos

