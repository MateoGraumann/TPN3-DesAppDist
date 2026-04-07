let vlansCache = []; // Array para almacenar las vlans

const renderVlans = (vlans) => { // Función para renderizar las vlans
    const bodyTable = document.getElementById('body-table-vlans'); // Obtiene el elemento tbody de la tabla
    bodyTable.innerHTML = vlans.map(vlan => `
        <tr>
            <td>${vlan.id}</td>
            <td>${vlan.nombre}</td>
            <td>${vlan.segmento}</td>
            <td>${vlan.cantidad_dispositivos}</td>
            <td>${vlan.estado}</td>
        </tr>
    `).join(''); 
} // Mapea las vlans dentro de la tabla

async function cargarVlans() {
    const response = await fetch('../db.json'); // Solicitud de datos
    dataJson = await response.json(); // Convierte los datos a formato JSON
    vlansCache = dataJson.vlans; // Almacena las vlans en el array
    renderVlans(vlansCache); // Renderiza las vlans
}

function filtrarVlans(event) {
    event.preventDefault(); // Evita que el formulario se envíe
    const termino = document.getElementById('input_busqueda').value.toLowerCase(); // Obtiene el valor del input
    const filtradas = vlansCache.filter(vlan =>
        vlan.nombre.toLowerCase().includes(termino) ||
        vlan.segmento.includes(termino) // Filtra las vlans por nombre o segmento
    );
    renderVlans(filtradas); // Renderiza las vlans filtradas
}

cargarVlans();