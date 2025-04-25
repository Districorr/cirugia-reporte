// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFtuuSPCcQIkgDN_F1WRS4U-71pRNCf_E",
  authDomain: "cirugia-reporte.firebaseapp.com",
  projectId: "cirugia-reporte",
  storageBucket: "cirugia-reporte.appspot.com",
  messagingSenderId: "698831567840",
  appId: "1:698831567840:web:fc6d6197f22beba4d88985",
  measurementId: "G-HD7ZLL1GLZ"
};

// Inicialización de Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para actualizar sugerencias de autocompletado
function actualizarSugerencias(idInput, idList) {
  const input = document.getElementById(idInput);
  const list = document.getElementById(idList);
  const key = `sugerencias_${idInput}`;
  const valores = JSON.parse(localStorage.getItem(key) || [];

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

// Función para obtener datos del formulario
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
    formato: document.getElementById('formato').value,
    timestamp: new Date().toISOString()
  };
}

// Función principal para generar el reporte
function generarTexto() {
  const d = obtenerDatos();
  const fecha = new Date(d.fechaCirugia);
  const df = isNaN(fecha.getTime()) ? 'Fecha inválida' : fecha.toLocaleDateString('es-AR');
  
  const line = (label, value) => `<strong>${label}</strong>: ${value || 'No especificado'}`;
  
  let claseFormato = '';
  let texto = '';

  switch(d.formato) {
    case 'formal':
      claseFormato = 'formato-formal';
      texto = `
        <div class="reporte-contenido">
          <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" style="max-width: 100px; margin-bottom: 15px;">
          <h3>🗓️ REPORTE DE CIRUGÍA PROGRAMADA</h3>
          <p>${d.mensajeInicio}</p>
          <ul>
            <li>${line('Paciente', d.paciente)}</li>
            <li>${line('Tipo de Cirugía', d.tipoCirugia)}</li>
            <li>${line('Médico Responsable', d.medico)}</li>
            <li>${line('Instrumentador', d.instrumentador)}</li>
            <li>${line('Fecha de Cirugía', df)}</li>
            <li>${line('Lugar de Cirugía', d.lugarCirugia)}</li>
          </ul>
          <h4>REQUERIMIENTOS</h4>
          <p>${d.material || 'No especificado'}</p>
          <h4>OBSERVACIONES</h4>
          <p>${d.observaciones || 'Ninguna'}</p>
          <p style="margin-top: 20px;">Gracias por su atención.<br><strong>Coordinación Districorr</strong></p>
        </div>`;
      break;

    case 'moderno':
      claseFormato = 'formato-moderno';
      texto = `
        <div class="reporte-contenido">
          <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" style="max-width: 80px; margin-bottom: 10px;">
          <h3>📅 Cirugía Programada</h3>
          <p>${d.mensajeInicio}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>${line('Paciente', d.paciente)}</div>
            <div>${line('Médico', d.medico)}</div>
            <div>${line('Fecha', df)}</div>
            <div>${line('Lugar', d.lugarCirugia)}</div>
          </div>
          <div style="margin-top: 15px;">
            <p>📌 <strong>Material requerido:</strong><br>${d.material || 'No especificado'}</p>
            <p>📝 <strong>Notas:</strong><br>${d.observaciones || 'Ninguna'}</p>
          </div>
          <p style="margin-top: 15px;">Saludos cordiales,<br>Equipo Districorr</p>
        </div>`;
      break;

    default: // Formato detallado
      claseFormato = 'formato-detallado';
      texto = `
        <div class="reporte-contenido">
          <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" style="max-width: 90px; margin-bottom: 12px;">
          <h3>📝 INFORME DETALLADO DE CIRUGÍA</h3>
          <p>${d.mensajeInicio}</p>
          
          <div style="background: #f5f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h4>📌 DATOS PRINCIPALES</h4>
            <ul>
              <li>${line('Paciente', d.paciente)}</li>
              <li>${line('Tipo de Cirugía', d.tipoCirugia)}</li>
              <li>${line('Médico', d.medico)}</li>
              <li>${line('Instrumentador', d.instrumentador)}</li>
              <li>${line('Fecha', df)}</li>
              <li>${line('Lugar', d.lugarCirugia)}</li>
            </ul>
          </div>
          
          <div style="background: #f5f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h4>🧾 MATERIAL REQUERIDO</h4>
            <p>${d.material || 'No especificado'}</p>
          </div>
          
          <div style="background: #f5f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h4>📝 OBSERVACIONES</h4>
            <p>${d.observaciones || 'Ninguna'}</p>
          </div>
          
          <p style="margin-top: 20px; text-align: right;">Atentamente,<br><strong>Districorr</strong></p>
        </div>`;
  }

  const resultado = document.getElementById('resultado-container');
  resultado.innerHTML = texto;
  resultado.className = `reporte-box ${claseFormato}`;
  resultado.style.display = 'block';
  
  // Actualizar texto plano para copiar
  document.getElementById('texto-plano-output').textContent = resultado.innerText;
}

// Función para copiar texto al portapapeles
function copiarTexto() {
  const text = document.getElementById('resultado-container').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Texto copiado al portapapeles');
    guardarEnFirebase(obtenerDatos());
  }).catch(err => {
    console.error('Error al copiar: ', err);
    alert('Error al copiar el texto');
  });
}

// Función para compartir por WhatsApp
function compartirWhatsApp() {
  const text = document.getElementById('resultado-container').innerText;
  const mensaje = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${mensaje}`, '_blank');
}

// Función para generar imagen del reporte
function generarImagen() {
  const elemento = document.getElementById('resultado-container');
  html2canvas(elemento).then(canvas => {
    const link = document.createElement('a');
    link.download = 'reporte-cirugia-' + new Date().toISOString().slice(0,10) + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// Función para enviar por email
function enviarPorEmail() {
  const texto = document.getElementById('resultado-container').innerText;
  const asunto = encodeURIComponent('Reporte de Cirugía');
  const cuerpo = encodeURIComponent(texto);
  window.location.href = `mailto:?subject=${asunto}&body=${cuerpo}`;
}

// Función para imprimir el reporte
function imprimirReporte() {
  const contenido = document.getElementById('resultado-container').innerHTML;
  const ventana = window.open('', '', 'width=800,height=600');
  ventana.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte de Cirugía</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        img { max-width: 100px; margin-bottom: 15px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
        .reporte-contenido { max-width: 700px; margin: 0 auto; }
      </style>
    </head>
    <body>
      ${contenido}
      <script>
        setTimeout(() => { window.print(); window.close(); }, 200);
      </script>
    </body>
    </html>
  `);
  ventana.document.close();
}

// Función para guardar en Firebase
function guardarEnFirebase(data) {
  // Mostrar indicador de carga
  document.body.classList.add('loading');
  
  db.collection("reportes").add(data)
    .then(() => {
      console.log("Reporte guardado en Firebase");
      // Ocultar indicador de carga
      document.body.classList.remove('loading');
    })
    .catch(error => {
      console.error("Error al guardar:", error);
      document.body.classList.remove('loading');
      alert("Ocurrió un error al guardar el reporte");
    });
}

// Función para ver estadísticas (placeholder)
function verEstadisticas() {
  alert('Función de estadísticas en desarrollo');
  // Redirigir a la página de admin
  window.location.href = 'admin.html';
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  // Configurar autocompletado
  actualizarSugerencias('medico', 'medicosList');
  actualizarSugerencias('instrumentador', 'instrumentadoresList');
  actualizarSugerencias('lugarCirugia', 'lugaresList');
  
  // Cargar último reporte si existe
  const ultimoReporte = localStorage.getItem('ultimoReporte');
  if (ultimoReporte) {
    document.getElementById('resultado-container').innerHTML = ultimoReporte;
    document.getElementById('resultado-container').style.display = 'block';
  }
  
  // Configurar el botón de descarga PDF
  document.querySelector('button[onclick="descargarPDF()"]').onclick = function() {
    imprimirReporte();
  };
});
