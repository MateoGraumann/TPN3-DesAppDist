const renderizarTablaProtocolos = (protocolos) => { 
    const bodyTableProtocolos = document.getElementById('body-table-protocolos'); // Obtiene el elemento tbody de la tabla
    bodyTableProtocolos.innerHTML = protocolos.map((protocolo) => `
            <tr>
                <td>${protocolo.nombre ?? '—'}</td>
                <td>${protocolo.estado ?? '—'}</td>
                <td>${protocolo.area ?? '—'}</td>
                <td>${protocolo.asn_local ?? '—'}</td>
                <td>${protocolo.asn_remoto ?? '—'}</td>
                <td>${protocolo.asn ?? '—'}</td>
                <td>${protocolo.neighbors ?? '—'}</td>
                <td>${protocolo.router_id ?? '—'}</td>
            </tr>
        `
        ).join('');
}; // Mapea los protocolos dentro de la tabla

const renderizarTablaEstadisticasTrafico = (trafico) => {
    const bodyTableEstadisticasTrafico = document.getElementById('body-table-estadisticas-trafico'); // Obtiene el elemento tbody de la tabla
    bodyTableEstadisticasTrafico.innerHTML = trafico.map((periodo) => `
        <tr>
            <td>${periodo.id ?? '—'}</td>
            <td>${periodo.hora ?? '—'}</td>
            <td>${periodo.in_mbps ?? '—'}</td>
            <td>${periodo.out_mbps ?? '—'}</td>
        </tr>
    `
    ).join('');
}; // Mapea las estadísticas de tráfico dentro de la tabla

async function cargarDashboardRed() { // Función para cargar el dashboard de red
    const [resProto, resTrafico] = await Promise.all([
        fetch('../db.json'), // Solicitud de datos
        fetch('../db.json') // Solicitud de datos
    ]);

    const [protocolosRaw, traficoRaw] = await Promise.all([ // Convierte los datos a formato JSON
        resProto.json().then((data) => data.protocolos ?? []),
        resTrafico.json().then((data) => data.trafico ?? []),
    ]);

    const dashboard = { // Objeto combinado de protocolos activos y estadísticas de tráfico
        protocolos_activos: protocolosRaw.filter((p) => p.estado === 'activo'), // Filtra los protocolos activos
        trafico_12_periodos: traficoRaw.slice(0, 12), // Obtiene las últimas 12 estadísticas de tráfico
    };

    renderizarTablaProtocolos(dashboard.protocolos_activos); // Renderiza la tabla de protocolos activos
    renderizarTablaEstadisticasTrafico(dashboard.trafico_12_periodos); // Renderiza la tabla de estadísticas de tráfico
}

cargarDashboardRed(); // Carga el dashboard de red