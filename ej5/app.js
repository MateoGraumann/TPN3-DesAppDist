const renderizarTabla = (alertas) => {
    const bodyTable = document.getElementById('body-table-alertas');
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
}

async function obtenerAlertas() {
    return fetch('../db.json')
    .then(res => res.json())
    .then(data => {
        const alertas = data.alertas;
        renderizarTabla(alertas);
    });
}

async function filtrarAlertas(event) {
    event.preventDefault();
    const severidad = document.getElementById('input_severidad').value || '';
    const estado = document.getElementById('input_estado').value || '';

    return fetch('../db.json')
    .then(res => res.json())
    .then(data => {
        const alertas = data.alertas;
        const alertasFiltradas = alertas.filter(alerta => alerta.severidad === severidad || alerta.estado === estado);
        const orden = { critica:0, alta:1, media:2, baja:3 };
        const alertasOrdenadas = alertasFiltradas.sort((a, b) => orden[a.severidad] - orden[b.severidad]);
        renderizarTabla(alertasOrdenadas);
    });
}

obtenerAlertas();