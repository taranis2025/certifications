// static/script.js
document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://certifier-backend.up.railway.app'; // ✅ Sin espacios

    const archivoInput = document.getElementById('archivo');
    const propietarioInput = document.getElementById('propietario');
    const btnCertificar = document.getElementById('btn-certificar');
    const resultadosDiv = document.getElementById('resultados');

    btnCertificar.addEventListener('click', () => {
        const archivo = archivoInput.files[0];
        if (!archivo) {
            alert('Selecciona un archivo');
            return;
        }

        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('propietario', propietarioInput.value || 'Usuario');

        fetch(`${BACKEND_URL}/api/certificar`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                resultadosDiv.textContent = `
📄 ${data.certificacion.nombre_archivo}
🔐 SHA-256: ${data.certificacion.hashes.sha256}
✅ Certificado: ${data.certificacion.fecha_certificacion}
                `.trim();
                resultadosDiv.className = 'results success';
            } else {
                resultadosDiv.textContent = `❌ Error: ${data.error}`;
                resultadosDiv.className = 'results error';
            }
        })
        .catch(err => {
            console.error(err);
            resultadosDiv.textContent = `❌ Error de red: ${err.message}`;
            resultadosDiv.className = 'results error';
        });
    });
});
