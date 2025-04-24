// script mejorado con optimización visual y botón para WhatsApp + campo "Lugar de Cirugía"
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

function generarTexto() {
  const d = obtenerDatos();
  const fecha = new Date(d.fechaCirugia + 'T00:00:00');
  const df = fecha.toLocaleDateString('es-AR', { timeZone: 'UTC' });
  const line = (label, value) => `<strong>${label}</strong>: ${value || 'No especificado'}`;

  let texto = '';
  if (d.formato === 'formal') {
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
  resultado.innerHTML = `
    <div class="reporte-box">
      ${texto}
  <div class="text-center">
  <button onclick="copiarTexto()">Copiar y Guardar</button>
  <button onclick="descargarPDF()">Descargar PDF</button>
  <button onclick="compartirWhatsApp()">Compartir por WhatsApp</button>
</div>
    </div>`;
}

function copiarTexto() {
  const text = document.querySelector('.reporte-box').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Texto copiado.');
    guardarEnFirebase(obtenerDatos());
  });
}

function compartirWhatsApp() {
  const texto = document.querySelector('.reporte-box').innerText;
  const mensaje = encodeURIComponent(texto);
  const url = `https://wa.me/?text=${mensaje}`;
  window.open(url, '_blank');
}

function guardarEnFirebase(data) {
  db.collection("reportes").add({ ...data, timestamp: new Date().toISOString() })
    .then(() => console.log("Guardado en Firebase"))
    .catch(e => console.error("Error al guardar", e));
}

window.onload = () => {
  actualizarSugerencias('medico', 'medicosList');
  actualizarSugerencias('instrumentador', 'instrumentadoresList');
  actualizarSugerencias('lugarCirugia', 'lugaresList');
};
