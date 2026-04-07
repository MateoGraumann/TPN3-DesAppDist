const renderizarTablaDispositivo = (dispositivo) => { // Función para renderizar la tabla con los dispositivos
    const bodyTable = document.getElementById('body-table-dispositivo'); // Obtiene el elemento tbody de la tabla
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

const renderizarTablaInterfaces = (interfaces) => { // Función para renderizar la tabla con las interfaces
    const bodyTable = document.getElementById('body-table-interfaces'); // Obtiene el elemento tbody de la tabla
    bodyTable.innerHTML = interfaces.map(iface => {
        const util = (iface.trafico_in / iface.velocidad * 100).toFixed(1);
        return `
            <tr>
                <td>${iface.nombre}</td>
                <td>${iface.ip}</td>
                <td>${iface.velocidad} Mbps</td>
                <td>${iface.estado}</td>
                <td>${iface.trafico_in} Mbps</td>
                <td>${iface.trafico_out} Mbps</td>
                <td>${util}%</td>
            </tr>
        `; // Mapea las interfaces dentro de la tabla
    }).join('');
}

async function obtenerInterfaces(event) {
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
        renderizarTablaDispositivo(dispositivo); // Renderiza la tabla con los dispositivos

        const interfaces = jsonData.interfaces.filter(interfaces => interfaces.dispositivo_id === parseInt(id)); // Obtiene los dispositivos del JSON
        if (!interfaces) {
            alert('Interfaces no encontradas');
            return;
        }
        renderizarTablaInterfaces(interfaces); // Renderiza la tabla con los dispositivos
    } catch (error) {
        console.error('Error:', error.message); // Maneja el error si la solicitud falla
    }
}