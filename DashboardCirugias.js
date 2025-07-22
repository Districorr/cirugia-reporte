// --- INICIO DE DashboardCirugias.js ---

class DashboardCirugias {
  // El constructor se ejecuta cuando creamos un nuevo dashboard.
  // 'elementSelector' es el ID del div donde se mostrará el dashboard (ej: '#dashboard-grid').
  constructor(elementSelector) {
    this.container = document.querySelector(elementSelector);
    if (!this.container) {
      console.error(`Error: No se encontró el elemento '${elementSelector}'.`);
      return;
    }
    
    this.db = null; // La conexión a la base de datos se establecerá después.
    this.surgeries = []; // Aquí guardaremos la lista de cirugías.
    
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
    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.db = firebase.firestore();
  }

  // 2. ESCUCHA LOS CAMBIOS EN LA BASE DE DATOS EN TIEMPO REAL
  listenForSurgeries() {
    const hoy = new Date();
    const hoyISO = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString().split('T')[0];

    this.db.collection('reportes')
      .where('fechaCirugia', '>=', hoyISO)
      .orderBy('fechaCirugia', 'asc')
      .onSnapshot(snapshot => {
        this.surgeries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.render(); // Llama a la función render cada vez que hay un cambio.
      }, error => {
        console.error("Error al escuchar las cirugías:", error);
        this.container.innerHTML = `<p style="color: red;">Error al cargar datos.</p>`;
      });
  }
  
  // 3. ACTUALIZA EL ESTADO DE UNA CIRUGÍA
  updateStatus(reporteId, nuevoEstado) {
    this.db.collection('reportes').doc(reporteId).update({
      estado: nuevoEstado
    }).catch(error => {
      console.error("Error al actualizar el estado: ", error);
    });
  }

  // 4. "DIBUJA" EL CONTENIDO DEL DASHBOARD
  render() {
    if (this.surgeries.length === 0) {
      this.container.innerHTML = `<p style="text-align: center; font-size: 1.2em; color: #555; grid-column: 1 / -1;">No hay cirugías programadas para hoy o fechas futuras.</p>`;
      return;
    }
    
    // Genera el HTML para cada tarjeta y las une todas
    this.container.innerHTML = this.surgeries.map(surgery => this._createCardHTML(surgery)).join('');
  }

  // 5. FUNCIÓN PRIVADA PARA CREAR EL HTML DE UNA SOLA TARJETA
  _createCardHTML(surgery) {
    const fecha = new Date(surgery.fechaCirugia + 'T12:00:00Z');
    const fechaFormateada = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const materialItems = (surgery.material || '')
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => `<li>${line.trim()}</li>`)
      .join('');

    const estado = surgery.estado || 'pendiente';

    // Usamos 'data-id' y 'data-estado' para que los botones sepan a qué cirugía pertenecen.
    // Los onclick ahora llaman a una función global que actuará como puente.
    return `
      <div class="surgery-card status-${estado}">
        <div class="card-header">
          <h4>${surgery.paciente}</h4>
          <span class="card-date">🕒 ${fechaFormateada}</span>
        </div>
        <div class="card-body">
          <p><strong>Médico:</strong> ${surgery.medico}</p>
          <p><strong>Cliente:</strong> ${surgery.cliente}</p>
          <h5>Material Requerido:</h5>
          <ul class="material-list">${materialItems}</ul>
        </div>
        <div class="card-footer">
          <button class="btn-status btn-proceso" onclick="window.dashboardComponent.updateStatus('${surgery.id}', 'en-proceso')">En Proceso</button>
          <button class="btn-status btn-completado" onclick="window.dashboardComponent.updateStatus('${surgery.id}', 'completado')">Completada</button>
          <button class="btn-status btn-pendiente" onclick="window.dashboardComponent.updateStatus('${surgery.id}', 'pendiente')">Marcar Pendiente</button>
        </div>
      </div>
    `;
  }
}

// --- FIN DE DashboardCirugias.js ---
