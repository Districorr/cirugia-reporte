// script.js - Versión corregida

// Función para actualizar sugerencias en los campos de entrada
function actualizarSugerencias(idInput, idList) {
  const input = document.getElementById(idInput);
  const list = document.getElementById(idList);
  const key = `sugerencias_${idInput}`;
  const valores = JSON.parse(localStorage.getItem(key) || "[]");

  input.addEventListener('change', () => {
    const nuevo = input.value.trim();
    if (nuevo && !valores.includes(nuevo)) {
      valores.push(nuevo);
      localStorage.setItem(key, JSON.stringify(valores));
      actualizarLista();
    }
  });

  function actualizarLista() {
    list.innerHTML = '';
    valores.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      list.appendChild(opt);
    });
  }

  actualizarLista();
}

// Función para obtener todos los datos del formulario
function obtenerDatos() {
  return {
    paciente: document.getElementById('paciente').value,
    medico: document.getElementById('medico').value,
    instrumentador: document.getElementById('instrumentador').value,
    lugarCirugia: document.getElementById('lugarCirugia').value,
    fechaCirugia: document.getElementById('fechaCirugia').value,
    tipoCirugia: document.getElementById('tipoCirugia').value,
    material: document.getElementById('material').value,
    observaciones: document.getElementById('observaciones').value,
    mensajeInicio: document.getElementById('mensajeInicio').value,
    infoAdicional: document.getElementById('infoAdicional').value,
    formato: document.getElementById('formato').value
  };
}

// Función principal para generar el texto del reporte
function generarTexto() {
  const d = obtenerDatos();
  const fecha = new Date(d.fechaCirugia + 'T00:00:00');
  const df = isNaN(fecha) ? 'Fecha inválida' : fecha.toLocaleDateString('es-AR', { timeZone: 'UTC' });
  const line = (label, value) => `<strong>${label}</strong>: ${value || 'No especificado'}`;

  let claseFormato = '';
  let texto = '';
  
  if (d.formato === 'formal') {
    claseFormato = 'formato-formal';
    texto = `
      <h3>🗓️ REPORTE DE CIRUGÍA PROGRAMADA</h3>
      <p>${d.mensajeInicio}</p>
      <ul>
        <li>${line('Paciente', d.paciente)}</li>
        <li>${line('Tipo de Cirugía', d.tipoCirugia)}</li>
        <li>${line('Médico Responsable', d.medico)}</li>
        <li>${line('Fecha de Cirugía', df)}</li>
        <li>${line('Lugar de Cirugía', d.lugarCirugia)}</li>
      </ul>
      <br>
      <ul>
        <li>${line('Material Requerido', d.material)}</li>
        <li>${line('Observaciones', d.observaciones)}</li>
        <li>${line('Información Adicional', d.infoAdicional)}</li>
      </ul>
      <p>Gracias por su atención.<br><strong>Coordinación Districorr</strong></p>`;
  } else if (d.formato === 'moderno') {
    claseFormato = 'formato-moderno';
    texto = `
      <h3>📅 Cirugía Programada</h3>
      <p>${d.mensajeInicio}</p>
      <ul>
        <li>${line('Paciente', d.paciente)}</li>
        <li>${line('Tipo', d.tipoCirugia)}</li>
        <li>${line('Médico', d.medico)}</li>
        <li>${line('Fecha', df)}</li>
        <li>${line('Lugar de Cirugía', d.lugarCirugia)}</li>
      </ul>
      <br>
      <ul>
        <li>${line('Material', d.material)}</li>
        <li>${line('Notas', d.observaciones)}</li>
      </ul>
      <p>Gracias, quedo a disposición. Saludos.</p>`;
  } else {
    claseFormato = 'formato-casual';
    texto = `
      <h3>📝 INFORME DETALLADO DE CIRUGÍA</h3>
      <p>${d.mensajeInicio}</p>
      <h4>📌 DATOS</h4>
      <ul>
        <li>${line('Paciente', d.paciente)}</li>
        <li>${line('Tipo de Cirugía', d.tipoCirugia)}</li>
        <li>${line('Lugar de Cirugía', d.lugarCirugia)}</li>
        <li>${line('Médico Responsable', d.medico)}</li>
        <li>${line('Fecha', df)}</li>
      </ul>
      <br>
      <h4>🧾 DETALLES</h4>
      <ul>
        <li>${line('Material', d.material)}</li>
        <li>${line('Observaciones', d.observaciones)}</li>
      </ul>
      <br>
      <h4>🧩 INFO ADICIONAL</h4>
      <p>${d.infoAdicional}</p>
      <p>Atte., Coordinación Districorr</p>`;
  }

  const resultado = document.getElementById('resultado-container');
  resultado.style.display = 'block';
  resultado.className = `reporte-box ${claseFormato}`;
  resultado.innerHTML = texto;

  document.getElementById('texto-plano-output').textContent = resultado.innerText;
  localStorage.setItem('ultimoReporte', texto);
}

// Función para copiar el texto al portapapeles
function copiarTexto() {
  const text = document.getElementById('resultado-container').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Texto copiado.');
    guardarEnFirebase(obtenerDatos());
  });
}

// Función para compartir por WhatsApp
function compartirWhatsApp() {
  const texto = document.getElementById('resultado-container').innerText;
  const mensaje = encodeURIComponent(texto);
  window.open(`https://wa.me/?text=${mensaje}`, '_blank');
}

// Función para generar imagen del reporte
function generarImagen() {
  const contenedor = document.getElementById('resultado-container');
  html2canvas(contenedor).then(canvas => {
    const link = document.createElement('a');
    link.download = 'Reporte_Cirugia.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

// Función para enviar por email
function enviarPorEmail() {
  const contenido = document.getElementById('resultado-container').innerText;
  const mailto = `mailto:?subject=Reporte de Cirugía&body=${encodeURIComponent(contenido)}`;
  window.location.href = mailto;
}

// Función para descargar como PDF
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const contenido = document.getElementById('resultado-container').innerText;
  doc.text(contenido, 10, 10);
  doc.save('reporte_cirugia.pdf');
}

// Función para imprimir el reporte
function imprimirReporte() {
  const contenido = document.getElementById('resultado-container').innerHTML;
  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`
    <html>
    <head>
      <title>Reporte de Cirugía</title>
      <link href="style.css" rel="stylesheet" />
      <style>
        body { font-family: 'Lato', sans-serif; padding: 20px; }
        img.logo { max-width: 120px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <img src="https://i.imgur.com/aA7RzTN.png" class="logo" />
      ${contenido}
    </body>
    </html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 1000);
}

// Función para guardar en Firebase
function guardarEnFirebase(data) {
  document.body.classList.add('loading');
  db.collection("reportes").add({ 
    ...data, 
    timestamp: new Date().toISOString() 
  })
  .then(() => {
    console.log("Guardado en Firebase");
    document.body.classList.remove('loading');
  })
  .catch(e => {
    console.error("Error al guardar", e);
    document.body.classList.remove('loading');
  });
}

// Función para ver estadísticas (placeholder)
function verEstadisticas() {
  alert('Función de estadísticas en desarrollo');
}

// Inicialización al cargar la página
window.onload = function() {
  actualizarSugerencias('medico', 'medicosList');
  actualizarSugerencias('instrumentador', 'instrumentadoresList');
  actualizarSugerencias('lugarCirugia', 'lugaresList');
  
  // Cargar último reporte si existe
  const ultimoReporte = localStorage.getItem('ultimoReporte');
  if (ultimoReporte) {
    document.getElementById('resultado-container').innerHTML = ultimoReporte;
    document.getElementById('resultado-container').style.display = 'block';
  }
};
