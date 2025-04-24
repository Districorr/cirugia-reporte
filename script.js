function actualizarSugerencias(idInput, idList) {
  const input = document.getElementById(idInput);
  const list = document.getElementById(idList);
  const key = `sugerencias_${idInput}`;
  const valores = JSON.parse(localStorage.getItem(key) || "[]");

  // Agregar nuevo valor si no existe
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
  const fechaInput = document.getElementById('fechaCirugia').value;
  const partesFecha = fechaInput.split("-");
  const fecha = new Date(Number(partesFecha[0]), Number(partesFecha[1]) - 1, Number(partesFecha[2]));
  const line = (label, value) => `${label}: ${value || 'No especificado'}`;
  let texto = '';
  if (d.formato === 'formal') {
    texto = [
      'REPORTE DE CIRUGÍA PROGRAMADA','', d.mensajeInicio,'',
      line('Paciente', d.paciente),
      line('Tipo de Cirugía', d.tipoCirugia),
      line('Médico Responsable', d.medico),
      line('Fecha de Cirugía', df),
      line('Material Requerido', d.material),
      line('Observaciones', d.observaciones),
      line('Información Adicional', d.infoAdicional),
      '', 'Gracias por su atención.', 'Coordinación Districorr'
    ].join('\n');
  } else if (d.formato === 'moderno') {
    texto = [
      'Cirugía Programada','', d.mensajeInicio,'',
      line('Paciente', d.paciente),
      line('Tipo', d.tipoCirugia),
      line('Médico', d.medico),
      line('Fecha', df),
      line('Material', d.material),
      line('Notas', d.observaciones),
      '', 'Gracias, quedo a disposición. Saludos.'
    ].join('\n');
  } else {
    texto = [
      'INFORME DETALLADO DE CIRUGÍA','', d.mensajeInicio,'',
      'DATOS:', line('Paciente', d.paciente),
      line('Tipo de Cirugía', d.tipoCirugia),
      line('Médico Responsable', d.medico),
      line('Fecha', df),'', 'DETALLES:',
      line('Material', d.material),
      line('Observaciones', d.observaciones),'',
      'INFO ADICIONAL:', d.infoAdicional,
      '', 'Atte., Coordinación Districorr'
    ].join('\n');
  }
  document.getElementById('resultado-container').style.display = 'block';
  document.getElementById('texto-plano-output').textContent = texto;
}

function copiarTexto() {
  const texto = document.getElementById('texto-plano-output').textContent;
  navigator.clipboard.writeText(texto).then(() => {
    alert('Texto copiado.');
    guardarEnFirebase(obtenerDatos());
  });
}

function guardarEnFirebase(data) {
  db.collection("reportes").add({
    ...data,
    timestamp: new Date().toISOString()
  }).then(() => console.log("Guardado en Firebase"))
    .catch(e => console.error("Error al guardar", e));
}

async function descargarPDF() {
  const texto = document.getElementById('texto-plano-output').textContent;
  if (!texto.trim()) return alert('Primero generá el texto.');

  const tmp = document.createElement('div');
  tmp.style = `
    width: 794px;
    height: 1123px;
    padding: 60px;
    font-family: 'Lato', sans-serif;
    font-size: 12pt;
    line-height: 1.6;
    background-color: #ffffff;
    color: #111;
    box-sizing: border-box;
  `;

  tmp.innerHTML = `
    <div style="text-align:center; margin-bottom: 30px;">
      <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" style="max-height:80px; margin-bottom: 10px;" />
      <h2 style="color:#003f63; margin:0;">Reporte de Cirugía</h2>
      <hr style="margin-top:20px; border:none; border-top:1px solid #003f63;" />
    </div>
    <pre style="white-space: pre-wrap;">${texto}</pre>
    <hr style="margin-top:30px; border:none; border-top:1px dashed #ccc;" />
    <div style="text-align:right; font-size:10pt; color:#888;">Generado por sistema Districorr</div>
  `;
window.onload = () => {
actualizarSugerencias('medico', 'medicosList');
  actualizarSugerencias('instrumentador', 'instrumentadoresList');
  actualizarSugerencias('lugarCirugia', 'lugaresList');
};

  document.body.appendChild(tmp);
  const canvas = await html2canvas(tmp, { scale: 2 });
  const img = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'pt', 'a4');
  pdf.addImage(img, 'PNG', 0, 0, 595, 842);
  pdf.save('Reporte_Cirugia.pdf');
  document.body.removeChild(tmp);
}
