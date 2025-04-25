function obtenerDatos() {
  return {
    formato: document.getElementById('formato').value,
    mensajeInicio: document.getElementById('mensajeInicio').value,
    paciente: document.getElementById('paciente').value.trim(),
    medico: document.getElementById('medico').value.trim(),
    instrumentador: document.getElementById('instrumentador').value.trim(),
    lugarCirugia: document.getElementById('lugarCirugia').value.trim(),
    fechaCirugia: document.getElementById('fechaCirugia').value,
    tipoCirugia: document.getElementById('tipoCirugia').value.trim(),
    material: document.getElementById('material').value.trim(),
    observaciones: document.getElementById('observaciones').value.trim(),
    infoAdicional: document.getElementById('infoAdicional').value.trim(),
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

    switch (d.formato) {
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
            <p class="firma">Atentamente, quedo a la espera de sus comentarios o preguntas.<br><strong>Coordinación Districorr</strong></p>
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
            <p class="firma">Agradeciendo de antemano su tiempo y consideración, me mantengo a su disposición.<br>Equipo Districorr</p>
          </div>`;
        break;

      default:
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

            <p class="firma">Sin otro particular por el momento, quedo atento a cualquier duda que pueda surgir<br><strong>Coordinacion Districorr</strong></p>
          </div>`;
    }

    const resultado = document.getElementById('resultado-container');
    if (resultado) {
      resultado.innerHTML = texto;
      resultado.className = `reporte-box ${claseFormato}`;
      resultado.style.display = 'block';

      const textoPlano = document.getElementById('texto-plano-output');
      if (textoPlano) {
        textoPlano.textContent = resultado.innerText;
      }

      // 🔍 Sugerencias según tipo de cirugía
      const yaExiste = document.getElementById('sugerencia-contextual');
      if (yaExiste) yaExiste.remove();

      const sugerencias = [];

      const tipo = (d.tipoCirugia || '').toLowerCase();

      if (tipo.includes('columna')) {
        sugerencias.push('⚠️ Verificar cementos.');
      }
      if (tipo.includes('descartable')) {
        sugerencias.push('🧪 Material descartable solicitado. Confirmar stock con depósito.');
      }
      if (tipo.includes('artroscopia')) {
        sugerencias.push('🔍 Confirmar set óptica, shaver, torre de artroscopía y sueros.');
      }
      if (tipo.includes('maxilofacial')) {
        sugerencias.push('👤 Confirmar instrumental fino, microplacas y tornillos mini.');
      }
      if (tipo.includes('hombro')) {
        sugerencias.push('🦾 Verificar set hombro y suturas ancladas (tipo PEEK o metálicas).');
      }

      if (sugerencias.length > 0) {
        const sugDiv = document.createElement('div');
        sugDiv.id = 'sugerencia-contextual';
        sugDiv.style = 'margin-top: 15px; padding: 15px; border-left: 5px solid #17a2b8; background: #e9f7fc; color: #333;';
        sugDiv.innerHTML = `<strong>Sugerencias inteligentes:</strong><ul style="margin-top: 10px;">${sugerencias.map(s => `<li>${s}</li>`).join('')}</ul>`;
        resultado.parentNode.insertBefore(sugDiv, resultado.nextSibling);
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
