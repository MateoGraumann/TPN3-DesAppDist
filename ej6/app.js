const mostrarResultadoPing = (resultado) => { // Función para mostrar el resultado del ping
    const bodyTable = document.getElementById('body-table-ping'); // Obtiene el elemento tbody de la tabla
    const stats = resultado.paquetes;
    const statsText = `${stats.enviados} enviados, ${stats.recibidos} recibidos, ${stats.perdidos} perdidos`;
    bodyTable.innerHTML = `
        <tr>
            <td>${resultado.host}</td>
            <td>${resultado.latencia_ms}ms</td>
            <td>${resultado.estado}</td>
            <td>${statsText}</td>
        </tr>
    `;
}; // Mapea el resultado del ping dentro de la tabla

async function hacerPing(host) { // Función para hacer el ping
    const opciones = { // Define las opciones de la petición
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ host, count: 4 }),
    };

    const response = await fetch('../db.json'); // Solicitud de datos

    if (!response.ok) { // Verifica si la solicitud fue exitosa
        throw new Error(`HTTP ${response.status}`); // Lanza un error si la solicitud falla
    }

    const data = await response.json(); // Convierte los datos a formato JSON
    const resultado = data.ping_samples.find(sample => sample.host === host); // Obtiene el resultado del ping del JSON

    return resultado; // Retorna el resultado del ping
}

async function enviarPing(event) { // Función para enviar el ping
    event.preventDefault(); // Evita que el formulario se envíe
    const host = document.getElementById('input_host').value.trim(); // Obtiene el valor del input
    try {
        const resultado = await hacerPing(host); // Hace el ping
        mostrarResultadoPing(resultado); // Muestra el resultado del ping
    } catch (error) { // Maneja el error si la solicitud falla
        console.error('Error:', error.message); // Muestra el error en la consola
        document.getElementById('body-table-ping').innerHTML = ''; // Limpia la tabla
        alert(`Error al hacer ping: ${error.message}`); // Muestra un mensaje de error
    }
}
