const renderizarTabla = (dispositivo) => { // Función para renderizar la tabla con los dispositivos
    const bodyTable = document.getElementById('body-table'); // Obtiene el elemento tbody de la tabla
    bodyTable.innerHTML = `
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
    `; // Mapea el dispositivo dentro de la tabla
}

async function obtenerDispositivo(event) {
    event.preventDefault(); // Evita que el formulario se envíe
    const id = document.getElementById('input_id').value; // Obtiene el valor del input
    try {
        const response = await fetch('../db.json'); // Solicitud de datos
        if (!response.ok) throw new Error(`HTTP ${response.status}`); // Verifica si la solicitud fue exitosa
        const jsonData = await response.json(); // Convierte los datos a formato JSON
        const dispositivo = jsonData.dispositivos.find(dispositivo => dispositivo.id === parseInt(id)); // Obtiene los dispositivos del JSON
        if (!dispositivo) {
            alert('Dispositivo no encontrado');
            return;
        }
        renderizarTabla(dispositivo); // Renderiza la tabla con los dispositivos
    } catch (error) {
        console.error('Error:', error.message); // Maneja el error si la solicitud falla
    }
}