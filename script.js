function obtenerDatos() {
  return {
    paciente: document.getElementById('paciente').value,
    medico: document.getElementById('medico').value,
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
  const df = new Date(d.fechaCirugia).toLocaleDateString('es-AR');
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
  tmp.style = 'width:595px;padding:40px;font-family:Lato;font-size:12pt;line-height:1.5;';
  tmp.innerHTML = '<h2 style="color:#003f63;">Reporte de Cirugía</h2><pre>' + texto + '</pre>';
  document.body.appendChild(tmp);
  const canvas = await html2canvas(tmp, { scale: 2 });
  const img = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'pt', 'a4');
  const w = 595, h = canvas.height * (595 / canvas.width);
  pdf.addImage(img, 'PNG', 0, 0, w, h);
  pdf.save('Reporte_Cirugia.pdf');
  document.body.removeChild(tmp);
}