// script.js - Versión corregida y verificada

// Configuración de Firebase (la misma que en tu HTML)
const firebaseConfig = {
  apiKey: "AIzaSyCFtuuSPCcQIkgDN_F1WRS4U-71pRNCf_E",
  authDomain: "cirugia-reporte.firebaseapp.com",
  projectId: "cirugia-reporte",
  storageBucket: "cirugia-reporte.appspot.com",
  messagingSenderId: "698831567840",
  appId: "1:698831567840:web:fc6d6197f22beba4d88985",
  measurementId: "G-HD7ZLL1GLZ"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para actualizar sugerencias
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

// Función principal para generar el texto
function generarTexto() {
  const d = obtenerDatos();
  const fecha = new Date(d.fechaCirugia + 'T00:00:00');
  const df = isNaN(fecha.getTime()) ? 'Fecha inválida' : fecha.toLocaleDateString('es-AR');
  
  const line = (label, value) => `<strong>${label}</strong>: ${value || 'No especificado'}`;

  let texto = '';
  let claseFormato = '';

  switch(d.formato) {
    case 'formal':
      claseFormato = 'formato-formal';
      texto = `<h3>🗓️ REPORTE DE CIRUGÍA PROGRAMADA</h3>
               <p>${d.mensajeInicio}</p>
               <ul>
                 <li>${line('Paciente', d.paciente)}</li>
                 <li>${line('Tipo de Cirugía', d.tipoCirugia)}</li>
                 <li>${line('Médico', d.medico)}</li>
                 <li>${line('Fecha', df)}</li>
                 <li>${line('Lugar', d.lugarCirugia)}</li>
               </ul>
               <ul>
                 <li>${line('Material', d.material)}</li>
                 <li>${line('Observaciones', d.observaciones)}</li>
                 <li>${line('Info Adicional', d.infoAdicional)}</li>
               </ul>
               <p>Gracias por su atención.<br>Coordinación Districorr</p>`;
      break;
      
    case 'moderno':
      claseFormato = 'formato-moderno';
      texto = `<h3>📅 Cirugía Programada</h3>
               <p>${d.mensajeInicio}</p>
               <ul>
                 <li>${line('Paciente', d.paciente)}</li>
                 <li>${line('Tipo', d.tipoCirugia)}</li>
                 <li>${line('Médico', d.medico)}</li>
                 <li>${line('Fecha', df)}</li>
                 <li>${line('Lugar', d.lugarCirugia)}</li>
               </ul>
               <p>📌 ${line('Material', d.material)}</p>
               <p>📝 ${line('Notas', d.observaciones)}</p>
               <p>Gracias, saludos cordiales.</p>`;
      break;
      
    default: // Casual/detallado
      claseFormato = 'formato-casual';
      texto = `<h3>📝 INFORME DE CIRUGÍA</h3>
               <p>${d.mensajeInicio}</p>
               <h4>📌 DATOS PRINCIPALES</h4>
               <ul>
                 <li>${line('Paciente', d.paciente)}</li>
                 <li>${line('Tipo', d.tipoCirugia)}</li>
                 <li>${line('Médico', d.medico)}</li>
                 <li>${line('Fecha', df)}</li>
                 <li>${line('Lugar', d.lugarCirugia)}</li>
               </ul>
               <h4>🧾 REQUERIMIENTOS</h4>
               <p>${d.material || 'Sin material especificado'}</p>
               <h4>📝 OBSERVACIONES</h4>
               <p>${d.observaciones || 'Ninguna'}</p>`;
  }

  const resultado = document.getElementById('resultado-container');
  resultado.innerHTML = texto;
  resultado.className = `reporte-box ${claseFormato}`;
  resultado.style.display = 'block';
  
  // Actualiza el texto plano para copiar
  document.getElementById('texto-plano-output').textContent = resultado.innerText;
}

// Resto de funciones (copiar, compartir, etc.)
function copiarTexto() {
  const text = document.getElementById('resultado-container').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Texto copiado al portapapeles');
    guardarEnFirebase(obtenerDatos());
  });
}

function compartirWhatsApp() {
  const text = encodeURIComponent(document.getElementById('resultado-container').innerText);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function generarImagen() {
  html2canvas(document.getElementById('resultado-container')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'reporte-cirugia.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

function guardarEnFirebase(data) {
  db.collection("reportes").add({
    ...data,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => console.log("Reporte guardado"))
  .catch(e => console.error("Error al guardar:", e));
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  actualizarSugerencias('medico', 'medicosList');
  actualizarSugerencias('instrumentador', 'instrumentadoresList');
  actualizarSugerencias('lugarCirugia', 'lugaresList');
});
