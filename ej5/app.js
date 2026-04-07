const renderizarTabla = (alertas) => { // Función para renderizar la tabla de alertas
    const bodyTable = document.getElementById('body-table-alertas'); // Obtiene el elemento tbody de la tabla
    bodyTable.innerHTML = alertas.map(alerta => `
        <tr>
            <td>${alerta.id}</td>
            <td>${alerta.timestamp}</td>
            <td>${alerta.dispositivo}</td>
            <td>${alerta.severidad}</td>
            <td>${alerta.estado}</td>
            <td>${alerta.mensaje}</td>
        </tr>
    `).join('');
} // Mapea las alertas dentro de la tabla

async function obtenerAlertas() { // Función para obtener las alertas
    return fetch('../db.json')
    .then(res => res.json()) // Convierte los datos a formato JSON
    .then(data => {
        const alertas = data.alertas; // Obtiene las alertas del JSON
        renderizarTabla(alertas); // Renderiza la tabla de alertas
    });
}

async function filtrarAlertas(event) { // Función para filtrar las alertas
    event.preventDefault(); // Evita que el formulario se envíe
    const severidad = document.getElementById('input_severidad').value || ''; // Obtiene el valor del input de severidad
    const estado = document.getElementById('input_estado').value || ''; // Obtiene el valor del input de estado

    return fetch('../db.json')
    .then(res => res.json()) // Convierte los datos a formato JSON
    .then(data => {
        const alertas = data.alertas; // Obtiene las alertas del JSON
        const alertasFiltradas = alertas.filter(alerta => alerta.severidad === severidad || alerta.estado === estado); // Filtra las alertas por severidad o estado
        const orden = { critica:0, alta:1, media:2, baja:3 }; // Define el orden de las alertas
        const alertasOrdenadas = alertasFiltradas.sort((a, b) => orden[a.severidad] - orden[b.severidad]);
        renderizarTabla(alertasOrdenadas); // Renderiza la tabla de alertas ordenadas
    });
}

obtenerAlertas(); // Obtiene las alertas y las renderiza en la tabla