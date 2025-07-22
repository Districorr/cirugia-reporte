// --- INICIO DE DashboardCirugias.js (VERSIÓN MEJORADA CON COLUMNAS) ---

class DashboardCirugias {
  // El constructor ahora recibe un objeto con los selectores de las 4 columnas.
  constructor(columnSelectors) {
    this.columns = {
      pendientes: document.querySelector(columnSelectors.pendientes),
      'en-proceso': document.querySelector(columnSelectors['en-proceso']),
      'en-transito': document.querySelector(columnSelectors['en-transito']),
      completado: document.querySelector(columnSelectors.completado)
    };
    
    // Verificamos que todas las columnas existan para evitar errores.
    if (Object.values(this.columns).some(col => !col)) {
      console.error("Error: No se encontraron todos los contenedores de columna. Revisa los IDs en dashboard.html.");
      return;
    }
    
    this.db = null; // La conexión a Firebase se asignará aquí.
    this.surgeries = []; // La lista de cirugías se guardará aquí.
    
    // Inicia la conexión y empieza a escuchar por cambios.
    this._initFirebase();
    this.listenForSurgeries();
  }

  // 1. INICIALIZA Y CONECTA A FIREBASE
  _initFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyCFtuuSPCcQIkgDN_F1WRS4U-71pRNCf_E",
      authDomain: "cirugia-reporte.firebaseapp.com",
      projectId: "cirugia-reporte",
      storageBucket: "cirugia-reporte.appspot.com",
      messagingSenderId: "698831567840",
      appId: "1:698831567840:web:fc6d6197f22beba4d88985",
      measurementId: "G-HD7ZLL1GLZ"
    };
    
    // Evita errores si el script se carga varias veces.
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.db = firebase.firestore();
  }

  // 2. ESCUCHA LOS CAMBIOS EN FIREBASE EN TIEMPO REAL
  listenForSurgeries() {
    const hoy = new Date();
    // Asegura que la fecha esté en formato YYYY-MM-DD para la comparación en Firebase.
    const hoyISO = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString().split('T')[0];

    this.db.collection('reportes')
      .where('fechaCirugia', '>=', hoyISO) // Solo cirugías de hoy en adelante.
      .orderBy('fechaCirugia', 'asc')       // Las más próximas primero.
      .onSnapshot(snapshot => {
        // Cuando hay un cambio, actualizamos nuestra lista de cirugías.
        this.surgeries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Y volvemos a "dibujar" todo el dashboard.
        this.render();
      }, error => {
        console.error("Error al escuchar las cirugías:", error);
        this.columns.pendientes.innerHTML = `<p class="empty-column-message" style="color:red;">Error al cargar datos.</p>`;
      });
  }
  
  // 3. ACTUALIZA EL ESTADO DE UNA CIRUGÍA EN LA BASE DE DATOS
  updateStatus(reporteId, nuevoEstado) {
    if (!reporteId || !nuevoEstado) {
      console.error("Falta ID del reporte o el nuevo estado para actualizar.");
      return;
    }
    this.db.collection('reportes').doc(reporteId).update({
      estado: nuevoEstado
    }).catch(error => {
      console.error("Error al actualizar el estado: ", error);
    });
  }

  // 4. "DIBUJA" EL DASHBOARD COMPLETO, CLASIFICANDO LAS TARJETAS
  render() {
    // Primero, limpiamos todas las columnas.
    Object.values(this.columns).forEach(col => { col.innerHTML = ''; });
    
    // Creamos un objeto para agrupar las cirugías por su estado.
    const groupedSurgeries = {
      pendientes: [],
      'en-proceso': [],
      'en-transito': [],
      completado: []
    };

    // Recorremos todas las cirugías y las ponemos en el grupo que les corresponde.
    this.surgeries.forEach(surgery => {
      const estado = surgery.estado || 'pendientes'; // Si no tiene estado, se asume 'pendiente'.
      if (groupedSurgeries[estado]) {
        groupedSurgeries[estado].push(surgery);
      } else {
        // Si por alguna razón una cirugía tiene un estado inválido, la enviamos a 'pendientes'.
        groupedSurgeries.pendientes.push(surgery);
      }
    });

    // Finalmente, dibujamos las tarjetas de cada grupo en su respectiva columna.
    for (const estado in groupedSurgeries) {
      const columnElement = this.columns[estado];
      if (columnElement) {
        if (groupedSurgeries[estado].length > 0) {
          // Generamos el HTML para todas las tarjetas de este estado y lo insertamos en la columna.
          columnElement.innerHTML = groupedSurgeries[estado].map(surgery => this._createCardHTML(surgery)).join('');
        } else {
          // Si no hay cirugías en este estado, mostramos un mensaje.
          columnElement.innerHTML = `<p class="empty-column-message">No hay cirugías en este estado.</p>`;
        }
      }
    }
  }

  // 5. FUNCIÓN INTERNA PARA CREAR EL HTML DE UNA ÚNICA TARJETA
  _createCardHTML(surgery) {
    // Formateamos la fecha para que sea más legible.
    const fecha = new Date(surgery.fechaCirugia + 'T12:00:00Z');
    const fechaFormateada = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });

    // Convertimos la lista de materiales en una lista HTML.
    const materialItems = (surgery.material || 'Sin especificar.')
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => `<li>${line.trim()}</li>`)
      .join('');

    const estado = surgery.estado || 'pendientes';

    // Devolvemos el string HTML de la tarjeta, con los datos y funciones correctas.
    return `
      <div class="surgery-card status-${estado}">
        <div class="card-header">
          <h4>${surgery.paciente || 'Paciente no especificado'}</h4>
          <span class="card-date">🗓️ ${fechaFormateada}</span>
        </div>
        <div class="card-body">
          <p><strong>👨‍⚕️ Médico:</strong> ${surgery.medico || '-'}</p>
          <p><strong>🏥 Cliente:</strong> ${surgery.cliente || '-'}</p>
          <h5>Material Requerido:</h5>
          <ul class="material-list">${materialItems}</ul>
        </div>
        <div class="card-footer">
          <button title="Marcar como 'En Proceso'" class="btn-status btn-proceso" onclick="window.dashboardComponent.updateStatus('${surgery.id}', 'en-proceso')">🟡</button>
          <button title="Marcar como 'En Tránsito'" class="btn-status btn-transito" onclick="window.dashboardComponent.updateStatus('${surgery.id}', 'en-transito')">🔴</button>
          <button title="Marcar como 'Completada'" class="btn-status btn-completado" onclick="window.dashboardComponent.updateStatus('${surgery.id}', 'completado')">🟢</button>
          <button title="Resetear a 'Pendiente'" class="btn-status btn-pendiente" onclick="window.dashboardComponent.updateStatus('${surgery.id}', 'pendientes')">⚪️</button>
        </div>
      </div>
    `;
  }
}

// --- FIN DE DashboardCirugias.js ---
