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

firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
});
const db = firebase.firestore();

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


// Función para obtener datos del formulario
function obtenerDatos() {
  return {
    paciente: document.getElementById('paciente')?.value || '',
    medico: document.getElementById('medico')?.value || '',
    instrumentador: document.getElementById('instrumentador')?.value || '',
    lugarCirugia: document.getElementById('lugarCirugia')?.value || '',
    fechaCirugia: document.getElementById('fechaCirugia')?.value || '',
    tipoCirugia: document.getElementById('tipoCirugia')?.value || '',
    material: document.getElementById('material')?.value || '',
    observaciones: document.getElementById('observaciones')?.value || '',
    mensajeInicio: document.getElementById('mensajeInicio')?.value || '',
    infoAdicional: document.getElementById('infoAdicional')?.value || '',
    formato: document.getElementById('formato')?.value || 'formal',
    timestamp: new Date().toISOString()
  };
}

// Función principal para generar el texto
function generarTexto() {
  try {
    const d = obtenerDatos();
    const fecha = d.fechaCirugia ? new Date(d.fechaCirugia) : new Date();
    const df = isNaN(fecha.getTime()) ? 'Fecha no especificada' : fecha.toLocaleDateString('es-AR');
    
    const line = (label, value) => `<strong>${label}</strong>: ${value || 'No especificado'}`;
    
    let claseFormato = '';
    let texto = '';

    switch(d.formato) {
      case 'formal':
        claseFormato = 'formato-formal';
        texto = `
          <div class="reporte-contenido">
            <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" style="max-height: 70px; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;">
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
            <p class="firma">Gracias por su atención.<br><strong>Coordinación Districorr</strong></p>
          </div>`;
        break;

      case 'moderno':
        claseFormato = 'formato-moderno';
        texto = `
          <div class="reporte-contenido">
           <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" style="max-height: 70px; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;">
            <h3>📅 Cirugía Programada</h3>
            <p>${d.mensajeInicio}</p>
            <div class="grid-datos">
              <div>${line('Paciente', d.paciente)}</div>
              <div>${line('Médico', d.medico)}</div>
              <div>${line('Fecha', df)}</div>
              <div>${line('Lugar', d.lugarCirugia)}</div>
            </div>
            <div class="seccion-datos">
              <p>📌 <strong>Material requerido:</strong><br>${d.material || 'No especificado'}</p>
              <p>📝 <strong>Notas:</strong><br>${d.observaciones || 'Ninguna'}</p>
            </div>
            <p class="firma">Saludos cordiales,<br>Equipo Districorr</p>
          </div>`;
        break;

      default: // Formato detallado
        claseFormato = 'formato-detallado';
        texto = `
          <div class="reporte-contenido">
            <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" style="max-height: 70px; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;">
            <h3>📝 INFORME DETALLADO DE CIRUGÍA</h3>
            <p>${d.mensajeInicio}</p>
            
            <div class="seccion-destacada">
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
            
            <div class="seccion-destacada">
              <h4>🧾 MATERIAL REQUERIDO</h4>
              <p>${d.material || 'No especificado'}</p>
            </div>
            
            <div class="seccion-destacada">
              <h4>📝 OBSERVACIONES</h4>
              <p>${d.observaciones || 'Ninguna'}</p>
            </div>
            
            <p class="firma">Atentamente,<br><strong>Districorr</strong></p>
          </div>`;
    }

    const resultado = document.getElementById('resultado-container');
    if (resultado) {
      resultado.innerHTML = texto;
      resultado.className = `reporte-box ${claseFormato}`;
      resultado.style.display = 'block';
      
      // Actualizar texto plano para copiar
      const textoPlano = document.getElementById('texto-plano-output');
      if (textoPlano) {
        textoPlano.textContent = resultado.innerText;
      }
    } else {
      console.error('Elemento resultado-container no encontrado');
      alert('Error al mostrar el resultado');
    }
  } catch (error) {
    console.error('Error en generarTexto:', error);
    alert('Ocurrió un error al generar el reporte');
  }
}

// Función para copiar texto
function copiarTexto() {
  try {
    const resultado = document.getElementById('resultado-container');
    if (!resultado || resultado.style.display === 'none') {
      alert('Primero genere un reporte');
      return;
    }

    const text = resultado.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert('Texto copiado al portapapeles');
      guardarEnFirebase(obtenerDatos());
    }).catch(err => {
      console.error('Error al copiar:', err);
      alert('Error al copiar el texto');
    });
  } catch (error) {
    console.error('Error en copiarTexto:', error);
    alert('Error al copiar el texto');
  }
}

// Función para guardar en Firebase
function guardarEnFirebase(data) {
  try {
    if (!db) {
      throw new Error('Base de datos no inicializada');
    }

    // Mostrar carga
    document.body.classList.add('loading');
    
    db.collection("reportes").add(data)
      .then(() => {
        console.log("Reporte guardado en Firebase");
      })
      .catch(error => {
        console.error("Error al guardar:", error);
        alert("Ocurrió un error al guardar el reporte");
      })
      .finally(() => {
        document.body.classList.remove('loading');
      });
  } catch (error) {
    console.error('Error en guardarEnFirebase:', error);
    document.body.classList.remove('loading');
    alert('Error al conectar con la base de datos');
  }
}

// Otras funciones (compartirWhatsApp, generarImagen, etc.)...
function compartirWhatsApp() {
  try {
    const resultado = document.getElementById('resultado-container');
    if (!resultado || resultado.style.display === 'none') {
      alert('Primero genere un reporte');
      return;
    }

    const text = resultado.innerText;
    const mensaje = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  } catch (error) {
    console.error('Error en compartirWhatsApp:', error);
    alert('Error al compartir por WhatsApp');
  }
}

function generarImagen() {
  try {
    const elemento = document.getElementById('resultado-container');
    if (!elemento || elemento.style.display === 'none') {
      alert('Primero genere un reporte');
      return;
    }

    html2canvas(elemento).then(canvas => {
      const link = document.createElement('a');
      link.download = 'reporte-cirugia-' + new Date().toISOString().slice(0,10) + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(error => {
      console.error('Error en html2canvas:', error);
      alert('Error al generar la imagen');
    });
  } catch (error) {
    console.error('Error en generarImagen:', error);
    alert('Error al generar la imagen');
  }
}

function enviarPorEmail() {
  try {
    const resultado = document.getElementById('resultado-container');
    if (!resultado || resultado.style.display === 'none') {
      alert('Primero genere un reporte');
      return;
    }

    const texto = resultado.innerText;
    const asunto = encodeURIComponent('Reporte de Cirugía');
    const cuerpo = encodeURIComponent(texto);
    window.location.href = `mailto:?subject=${asunto}&body=${cuerpo}`;
  } catch (error) {
    console.error('Error en enviarPorEmail:', error);
    alert('Error al preparar el email');
  }
}

function imprimirReporte() {
  try {
    const resultado = document.getElementById('resultado-container');
    if (!resultado || resultado.style.display === 'none') {
      alert('Primero genere un reporte');
      return;
    }

    const contenido = resultado.innerHTML;
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
          setTimeout(() => { 
            window.print(); 
            setTimeout(() => { window.close(); }, 500);
          }, 200);
        </script>
      </body>
      </html>
    `);
    ventana.document.close();
  } catch (error) {
    console.error('Error en imprimirReporte:', error);
    alert('Error al preparar la impresión');
  }
}

function verEstadisticas() {
  window.location.href = 'admin.html';
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Configurar autocompletado
    actualizarSugerencias('medico', 'medicosList');
    actualizarSugerencias('instrumentador', 'instrumentadoresList');
    actualizarSugerencias('lugarCirugia', 'lugaresList');
    
    // Verificar si html2canvas está cargado
    if (typeof html2canvas !== 'function') {
      console.warn('html2canvas no está cargado correctamente');
    }
    
    // Verificar Firebase
    if (!firebase.apps.length) {
      console.warn('Firebase no se inicializó correctamente');
    }
  } catch (error) {
    console.error('Error en la inicialización:', error);
  }
});
