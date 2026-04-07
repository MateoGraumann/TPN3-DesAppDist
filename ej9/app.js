const renderizarDns = (registros) => {
    const body = document.getElementById('body-table-dns'); // Obtiene el elemento tbody de la tabla
    body.innerHTML = registros.map((r) => `
        <tr>
            <td>${r.host}</td>
            <td>${r.tipo}</td>
            <td>${r.valor}</td>
        </tr>
    `
    ).join('');
}; // Mapea los registros DNS dentro de la tabla

const renderizarResultado = (obj) => {
    document.getElementById('resultado-json').textContent = JSON.stringify(obj, null, 2);
};

async function consultarIPInfo(ip) { // Función para consultar la información de la IP
    const resIP = await fetch('../db.json'); // Solicitud de datos
    if (!resIP.ok) throw new Error(`HTTP ${resIP.status}`); // Verifica si la solicitud fue exitosa
    const data = await resIP.json(); // Convierte los datos a formato JSON
    const info = data.ipinfo.find((x) => x.ip === ip); // Obtiene la información de la IP
    if (!info) throw new Error('IP no encontrada en ipinfo'); // Lanza un error si la IP no se encuentra en ipinfo
    return info; // Retorna la información de la IP
}

async function consultarDNS() { // Función para consultar los registros DNS
    const resDNS = await fetch('../db.json'); // Solicitud de datos
    if (!resDNS.ok) throw new Error(`HTTP ${resDNS.status}`); // Verifica si la solicitud fue exitosa
    const data = await resDNS.json(); // Convierte los datos a formato JSON
    return data.dns ?? []; // Retorna los registros DNS
}

async function consultarIP(event) { // Función para consultar la información de la IP
    event.preventDefault(); // Evita que el formulario se envíe

    const ip = document.getElementById('input_ip').value.trim(); // Obtiene el valor del input

    // Validación RegExp (formato IPv4)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/; // Expresión regular para validar el formato IPv4
    if (!ipRegex.test(ip)) {
        alert('IP inválida'); // Muestra un mensaje de error si la IP no es válida
        return;
    }

    try {
        // Fetch encadenado: el resultado de la primera alimenta el flujo del segundo
        const infoIP = await consultarIPInfo(ip);
        const registros = await consultarDNS();

        // Spread operator para combinar objetos
        const resultado = { ...infoIP, dns_registros: registros };

        renderizarResultado(resultado); // Renderiza el resultado combinado
        renderizarDns(registros); // Renderiza los registros DNS
    } catch (e) {
        console.error('Error:', e.message); // Muestra el error en la consola
        document.getElementById('resultado-json').textContent = ''; // Limpia el resultado combinado
        document.getElementById('body-table-dns').innerHTML = ''; // Limpia la tabla de registros DNS
        alert(e.message); // Muestra un mensaje de error
    }
}