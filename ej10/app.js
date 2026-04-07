const renderizarEstadoEndpoints = (items) => { // Función para renderizar el estado de los endpoints
    const lista = document.getElementById('lista-endpoints'); // Obtiene el elemento ul de la lista
    lista.innerHTML = items.map((x) => {
        const icono = x.status === 'fulfilled' ? '✅' : '❌'; // Obtiene el icono del estado
        const detalle = x.status === 'fulfilled' ? 'OK' : (x.reason?.message ?? String(x.reason ?? 'Error')); // Obtiene el detalle del estado
        return `<li>${icono} ${x.nombre}: ${detalle}</li>`;
    })
    .join(''); // Mapea los items dentro de la lista
};

const renderizarSLA = (sla) => { // Función para renderizar el SLA
    const body = document.getElementById('body-table-sla'); // Obtiene el elemento tbody de la tabla
    body.innerHTML = sla.map((s) => `
        <tr>
            <td>${s.servicio}</td>
            <td>${s.disponibilidad_pct}</td>
            <td>${s.latencia_promedio_ms}</td>
            <td>${s.jitter_ms}</td>
            <td>${s.paquetes_perdidos_pct}</td>
        </tr>
    `
    ).join(''); // Mapea los sla dentro de la tabla
};

const renderizarMetricasGlobales = (obj) => { // Función para renderizar las métricas globales
    document.getElementById('metricas-globales').textContent = JSON.stringify(obj, null, 2); // Muestra las métricas globales en el pre
};

const fetchSeccion = async (seccion) => { // Función para obtener los datos de la sección
    const response = await fetch('../db.json'); // Solicitud de datos
    if (!response.ok) throw new Error(`HTTP ${response.status}`); // Verifica si la solicitud fue exitosa
    const data = await response.json(); // Convierte los datos a formato JSON
    return data[seccion]; // Retorna los datos de la sección
};

async function generarReporteSLA() { // Función para generar el reporte de SLA
    const resultados = await Promise.allSettled([ // Se obtienen los datos de las secciones
        fetchSeccion('sla'),
        fetchSeccion('dispositivos'),
        fetchSeccion('alertas'),
    ]);

    const endpoints = [ // Datos de los endpoints
        { nombre: '/api/sla', ...resultados[0] },
        { nombre: '/api/dispositivos', ...resultados[1] },
        { nombre: '/api/alertas', ...resultados[2] },
    ];

    endpoints.forEach((r, i) => { // Se verifica el estado de los endpoints
        if (r.status === 'fulfilled') {
            console.log(`✅ Endpoint ${i + 1} OK`);
        } else {
            console.warn(`❌ Endpoint ${i + 1}:`, r.reason);
        }
    });

    renderizarEstadoEndpoints(endpoints); // Se renderiza el estado de los endpoints

    const sla = resultados[0].status === 'fulfilled' ? resultados[0].value : []; // Se obtiene el SLA
    const dispositivos = resultados[1].status === 'fulfilled' ? resultados[1].value : []; // Se obtiene el dispositivos
    const alertas = resultados[2].status === 'fulfilled' ? resultados[2].value : []; // Se obtiene el alertas

    const dispositivosActivos = dispositivos.filter((d) => d.estado === 'up').length; // Se obtiene el número de dispositivos activos
    const dispositivosCaidos = dispositivos.filter((d) => d.estado === 'down').length; // Se obtiene el número de dispositivos caídos
    const alertasCriticasAbiertas = alertas.filter((a) => a.severidad === 'critica' && a.estado === 'abierta').length; // Se obtiene el número de alertas críticas abiertas

    const metricas = { // Se obtiene las métricas
        dispositivos_activos: dispositivosActivos,
        dispositivos_caidos: dispositivosCaidos,
        alertas_criticas_abiertas: alertasCriticasAbiertas,
    };

    renderizarMetricasGlobales(metricas); // Se renderiza las métricas globales
    renderizarSLA(sla); // Se renderiza el SLA
}