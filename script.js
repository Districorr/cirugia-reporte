
function generarTexto() {
  const paciente = document.getElementById('paciente').value;
  const medico = document.getElementById('medico').value;
  const fecha = document.getElementById('fechaCirugia').value;
  const tipo = document.getElementById('tipoCirugia').value;
  const material = document.getElementById('material').value;
  const formato = document.getElementById('formato').value;
  const lugar = document.getElementById('lugar').value;
  const instrumentador = document.getElementById('instrumentador').value;
  const saludo = document.getElementById('mensajeInicio').value;

  const mensaje = `${saludo}.
Paciente: ${paciente}
Médico: ${medico}
Lugar: ${lugar}
Instrumentador: ${instrumentador}
Fecha: ${fecha}
Tipo: ${tipo}
Material: ${material}`;

  const contenedor = document.getElementById('resultado-container');
  contenedor.style.display = 'block';
  contenedor.textContent = mensaje;
}

function copiarTexto() {
  const text = document.getElementById('resultado-container').textContent;
  navigator.clipboard.writeText(text).then(() => alert('Texto copiado al portapapeles'));
}

function compartirWhatsApp() {
  const text = encodeURIComponent(document.getElementById('resultado-container').textContent);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function enviarPorEmail() {
  const text = encodeURIComponent(document.getElementById('resultado-container').textContent);
  window.location.href = `mailto:?subject=Reporte de Cirugía&body=${text}`;
}

function imprimirReporte() {
  window.print();
}
