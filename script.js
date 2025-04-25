// Firebase config (solo debe estar en index.html)
// Este bloque debe ir en index.html, no en script.js:
// const firebaseConfig = { ... } y firebase.initializeApp(...)

const db = window.db; // Se usa la instancia global

function aplicarFondoDinamico() {
  const body = document.body;
  const dia = new Date().getDay();

  const mensajes = [
    '¡Feliz domingo!', '¡Buen lunes!', '¡Buen martes!',
    '¡Miércoles productivo!', '¡Jueves activo!',
    '¡Viernes con energía!', '¡Sábado de cirugías!'
  ];

  const fondos = {
    0: "url('https://images.unsplash.com/photo-1588776814546-ec7e4c1a1d4d?auto=format&fit=crop&w=1920&q=80')",
    1: "url('https://images.unsplash.com/photo-1606813909027-5e0b8c1a1d4d?auto=format&fit=crop&w=1920&q=80')",
    2: "url('https://images.unsplash.com/photo-1588776814546-ec7e4c1a1d4d?auto=format&fit=crop&w=1920&q=80')",
    3: "url('https://images.unsplash.com/photo-1606813909027-5e0b8c1a1d4d?auto=format&fit=crop&w=1920&q=80')",
    4: "url('https://images.unsplash.com/photo-1588776814546-ec7e4c1a1d4d?auto=format&fit=crop&w=1920&q=80')",
    5: "url('https://images.unsplash.com/photo-1606813909027-5e0b8c1a1d4d?auto=format&fit=crop&w=1920&q=80')",
    6: "url('https://images.unsplash.com/photo-1588776814546-ec7e4c1a1d4d?auto=format&fit=crop&w=1920&q=80')",
  };

  body.style.backgroundImage = fondos[dia];
  body.classList.add('fondo-dinamico');

  const contenedor = document.querySelector('.container');
  const banner = document.createElement('div');
  banner.textContent = mensajes[dia];
  banner.style = 'text-align:center; padding:10px; background:#ffffffcc; font-weight:bold; font-size:18px; margin-bottom:15px; border-radius:8px;';
  if (contenedor) contenedor.insertBefore(banner, contenedor.firstChild);
}

window.addEventListener('DOMContentLoaded', aplicarFondoDinamico);

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
        texto = `...`; // omitido para brevedad
        break;
      case 'moderno':
        claseFormato = 'formato-moderno';
        texto = `...`;
        break;
      default:
        claseFormato = 'formato-detallado';
        texto = `...`;
        break;
    }

    const resultado = document.getElementById('resultado-container');
    if (resultado) {
      resultado.innerHTML = texto;
      resultado.className = `reporte-box ${claseFormato}`;
      resultado.style.display = 'block';
      const textoPlano = document.getElementById('texto-plano-output');
      if (textoPlano) textoPlano.textContent = resultado.innerText;
    } else {
      console.error('Elemento resultado-container no encontrado');
      alert('Error al mostrar el resultado');
    }
  } catch (error) {
    console.error('Error en generarTexto:', error);
    alert('Error al generar el reporte: ' + error.message);
  }
}

function copiarTexto() {
  try {
    const resultado = document.getElementById('resultado-container');
    if (!resultado || resultado.style.display === 'none') {
      alert('Primero genere un reporte');
      return;
    }
    const text = resultado.innerText;
    navigator.clipboard.writeText(text).then(() => {
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

function guardarEnFirebase(data) {
  try {
    if (!data || !data.timestamp) throw new Error('Datos inválidos para guardar');
    if (!db || typeof db.collection !== 'function') throw new Error('Firebase no está inicializado');
    document.body.classList.add('loading');
    db.collection("reportes").add(data)
      .then(() => mostrarToast("✅ Reporte guardado correctamente"))
      .catch(error => {
        console.error("❌ Error al guardar en Firestore:", error);
        alert("Error al guardar: " + error.message);
      })
      .finally(() => document.body.classList.remove('loading'));
  } catch (error) {
    console.error("⚠️ Error en guardarEnFirebase:", error);
    alert("Error crítico: " + error.message);
    document.body.classList.remove('loading');
  }
}

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.style.display = 'block';
  setTimeout

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
    if (!data || !data.timestamp) throw new Error('Datos inválidos para guardar');
    if (!db || typeof db.collection !== 'function') throw new Error('Firebase no está inicializado');

    document.body.classList.add('loading');

    db.collection("reportes").add(data)
      .then(() => {
        console.log("✅ Reporte guardado en Firebase");
        mostrarToast("✅ Reporte guardado correctamente");
      })
      .catch(error => {
        console.error("❌ Error al guardar en Firestore:", error);
        alert("Error al guardar: " + error.message);
      })
      .finally(() => {
        document.body.classList.remove('loading');
      });
  } catch (error) {
    console.error("⚠️ Error en guardarEnFirebase:", error);
    alert("Error crítico: " + error.message);
    document.body.classList.remove('loading');
  }
}
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
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
