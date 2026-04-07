const iconos = {
    router: '🧭',
    switch_l3: '🔀',
    firewall: '🧱',
    ap: '📶',
    server: '🖥️',
    nube: '☁️',
};

const renderizarNodos = (nodos) => {
    const lista = document.getElementById('lista-nodos'); // Obtiene el elemento ul de la lista
    lista.innerHTML = nodos.map((nodo) => { 
        const icono = iconos[nodo.tipo] || '❔'; // Obtiene el icono del tipo de nodo
        const estadoIcono = nodo.estado === 'down' ? '🔴' : '🟢'; // Obtiene el estado del nodo
        const estilo = nodo.estado === 'down' ? 'style="color: red; font-weight: 700;"' : ''; // Obtiene el estilo del nodo
        return `<li ${estilo}>${icono} ${nodo.label} ${estadoIcono}</li>`; // Mapea el nodo dentro de la lista
    })
    .join('');
};

const renderizarEnlaces = (nodos, enlaces) => { 
    const body = document.getElementById('body-table-enlaces'); // Obtiene el elemento tbody de la tabla
    body.innerHTML = enlaces.map((enlace) => {
        const origen = nodos.find(n => n.id === enlace.origen).label;
        const destino = nodos.find(n => n.id === enlace.destino).label;
        return `
                <tr>
                    <td>${origen}</td>
                    <td>${destino}</td>
                    <td>${enlace.velocidad}</td>
                    <td>${enlace.tipo}</td>
                </tr>`;
    }).join('');
}; // Mapea los enlaces dentro de la tabla

async function cargarTopologia() {
    const response = await fetch('../db.json'); // Solicitud de datos
    if (!response.ok) throw new Error(`HTTP ${response.status}`); // Verifica si la solicitud fue exitosa

    const data = await response.json(); // Convierte los datos a formato JSON
    const topologia = data.topologia[0]; // Obtiene la topología de red

    // Destructuración 
    const { nodos, enlaces } = topologia;

    renderizarNodos(nodos);
    renderizarEnlaces(nodos, enlaces);
}

cargarTopologia(); // Carga la topología de red