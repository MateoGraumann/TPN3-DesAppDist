const mostrarResultadoPing = (resultado) => {
    const bodyTable = document.getElementById('body-table-ping');
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
};

async function hacerPing(host) {
    const opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ host, count: 4 }),
    };

    const response = await fetch('../db.json');

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const resultado = data.ping_samples.find(sample => sample.host === host);

    return resultado;
}

async function enviarPing(event) {
    event.preventDefault();
    const host = document.getElementById('input_host').value.trim();
    try {
        const resultado = await hacerPing(host);
        mostrarResultadoPing(resultado);
    } catch (error) {
        console.error('Error:', error.message);
        document.getElementById('body-table-ping').innerHTML = '';
        alert(`Error al hacer ping: ${error.message}`);
    }
}
