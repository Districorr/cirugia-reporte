function obtenerDatos() {
  return {
    paciente: document.getElementById('paciente').value,
    medico: document.getElementById('medico').value,
    fechaCirugia: document.getElementById('fechaCirugia').value,
    tipoCirugia: document.getElementById('tipoCirugia').value,
    material: document.getElementById('material').value,
    observaciones: document.getElementById('observaciones').value,
    mensajeInicio: document.getElementById('mensajeInicio').value,
    infoAdicional: document.getElementById('infoAdicional').value
  };
}

function generarTexto() {
  const d = obtenerDatos();
  const df = new Date(d.fechaCirugia).toLocaleDateString('es-AR');
  let texto = [
    'REPORTE DE CIRUGÍA PROGRAMADA',
    '',
    d.mensajeInicio,
    '',
    `Paciente: ${d.paciente}`,
    `Tipo de Cirugía: ${d.tipoCirugia}`,
    `Médico Responsable: ${d.medico}`,
    `Fecha de Cirugía: ${df}`,
    `Material Requerido: ${d.material}`,
    `Observaciones: ${d.observaciones}`,
    `Información Adicional: ${d.infoAdicional}`,
    '',
    'Gracias por su atención.',
    'Coordinación Districorr'
  ].join('\n');
  document.getElementById('resultado-container').style.display = 'block';
  document.getElementById('texto-plano-output').textContent = texto;
}

function copiarTexto() {
  const texto = document.getElementById('texto-plano-output').textContent;
  navigator.clipboard.writeText(texto).then(() => alert('Texto copiado.'));
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