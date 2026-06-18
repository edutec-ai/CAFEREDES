// ordenes.js - PASO 7: VERSIÓN FINAL COMPLETA
console.log('🔥 ordenes.js CARGADO - VERSIÓN FINAL');

function renderOrdenes(filtroEST = 'TODOS', filtroTexto = '', filtroEstado = 'TODOS', fechaDesde = '', fechaHasta = '') {
    console.log('✅ renderOrdenes EJECUTADA');

    let filtered = datos.ordenes;
    const user = window.usuarioActual || null;

    // Si es instalador, solo ver sus órdenes
    if (user && user.rol === 'INSTALADOR') {
        filtered = filtered.filter(o => o.tecnico === user.nombre);
    }

    // ===== FILTROS =====
    if (filtroEST !== 'TODOS') {
        const est = parseInt(filtroEST);
        const estados = EST_A_CAFEREDES[est] || [];
        filtered = filtered.filter(o => estados.includes(o.estado_caferedes));
    }

    if (filtroEstado !== 'TODOS') {
        filtered = filtered.filter(o => o.estado_caferedes === filtroEstado);
    }

    if (filtroTexto) {
        const txt = filtroTexto.toLowerCase();
        filtered = filtered.filter(o =>
            o.orden_trabajo.toLowerCase().includes(txt) ||
            o.direccion.toLowerCase().includes(txt) ||
            o.nombre_suscriptor.toLowerCase().includes(txt) ||
            (o.tecnico && o.tecnico.toLowerCase().includes(txt))
        );
    }

    const fechaDesdeInput = document.getElementById('fechaDesde')?.value || fechaDesde;
    const fechaHastaInput = document.getElementById('fechaHasta')?.value || fechaHasta;
    
    if (fechaDesdeInput) {
        filtered = filtered.filter(o => o.fecha_asignacion && o.fecha_asignacion >= fechaDesdeInput);
    }
    if (fechaHastaInput) {
        filtered = filtered.filter(o => o.fecha_asignacion && o.fecha_asignacion <= fechaHastaInput);
    }

    // ===== ESTADÍSTICAS =====
    const total = filtered.length;
    const est5 = filtered.filter(o => EST_A_CAFEREDES[5].includes(o.estado_caferedes)).length;
    const est7 = filtered.filter(o => EST_A_CAFEREDES[7].includes(o.estado_caferedes)).length;
    const est8 = filtered.filter(o => EST_A_CAFEREDES[8].includes(o.estado_caferedes)).length;
    const puedeEditar = user && (user.rol === 'SUPER' || user.rol === 'AUXILIAR' || user.rol === 'INSTALADOR');

    // ===== OPCIONES FILTROS =====
    const estOptions = [
        { value: 'TODOS', label: 'Todos' },
        { value: '5', label: 'Generadas [5]' },
        { value: '7', label: 'Intervenidas [7]' },
        { value: '8', label: 'Revisadas [8]' }
    ];

    const estadosUnicos = [...new Set(datos.ordenes.map(o => o.estado_caferedes))].filter(Boolean).sort();

    document.getElementById('mainContent').innerHTML = `
        <div class="glass-panel" style="padding:20px;">
            <h3 style="margin-bottom:16px;">📋 Órdenes</h3>
            
            <!-- ===== FILTROS ===== -->
            <div class="filters-row" style="margin-bottom:12px;">
                <label>Filtrar por EST:</label>
                <select id="filtroEST">
                    ${estOptions.map(e => `<option value="${e.value}" ${e.value === filtroEST ? 'selected' : ''}>${e.label}</option>`).join('')}
                </select>
                
                <label>Estado CAFEREDES:</label>
                <select id="filtroEstadoCaferedes">
                    <option value="TODOS" ${filtroEstado === 'TODOS' ? 'selected' : ''}>Todos</option>
                    ${estadosUnicos.map(e => `<option value="${e}" ${filtroEstado === e ? 'selected' : ''}>${getEstadoLabel(e)}</option>`).join('')}
                </select>
                
                <label>Buscar:</label>
                <input type="text" id="filtroTextoOrdenes" placeholder="OT, dirección, cliente..." style="min-width:180px;" value="${filtroTexto}">
                <button class="btn-sm primary" id="btnBuscarOrdenes">🔍 Buscar</button>
                <button class="btn-sm" id="limpiarFiltrosOrdenes">Limpiar</button>
            </div>
            
            <!-- ===== FECHAS ===== -->
            <div class="filters-row" style="margin-bottom:16px; border-top:1px solid var(--glass-border); padding-top:12px;">
                <label>📅 Fecha asignación:</label>
                <input type="date" id="fechaDesde" style="min-width:140px;" value="${fechaDesdeInput}">
                <label>hasta</label>
                <input type="date" id="fechaHasta" style="min-width:140px;" value="${fechaHastaInput}">
                <button class="btn-sm" id="btnFiltrarFechas">Aplicar fechas</button>
                <span class="text-muted" style="font-size:0.65rem;">Opcional</span>
            </div>
            
            <!-- ===== ESTADÍSTICAS ===== -->
            <div class="stats-grid" style="margin-bottom:16px; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr));">
                <div class="glass-card stat-card" data-estado="TOTAL" style="cursor:pointer;">
                    <div class="stat-icon">📊</div>
                    <div class="stat-value blanco" style="font-size:1.4rem;">${total}</div>
                    <div class="stat-label">Total</div>
                </div>
                <div class="glass-card stat-card" data-estado="5" style="cursor:pointer;">
                    <div class="stat-icon">🟡</div>
                    <div class="stat-value amarillo" style="font-size:1.4rem;">${est5}</div>
                    <div class="stat-label">Gen [5]</div>
                </div>
                <div class="glass-card stat-card" data-estado="7" style="cursor:pointer;">
                    <div class="stat-icon">🔵</div>
                    <div class="stat-value azul" style="font-size:1.4rem;">${est7}</div>
                    <div class="stat-label">Int [7]</div>
                </div>
                <div class="glass-card stat-card" data-estado="8" style="cursor:pointer;">
                    <div class="stat-icon">🟢</div>
                    <div class="stat-value verde" style="font-size:1.4rem;">${est8}</div>
                    <div class="stat-label">Rev [8]</div>
                </div>
            </div>
            
            <!-- ===== TABLA ===== -->
            <div class="glass-panel" style="padding:4px 0;">
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>OT</th>
                                <th>Dirección</th>
                                <th>Suscriptor</th>
                                <th>Técnico</th>
                                <th>EST</th>
                                <th>Estado</th>
                                <th>F. Asignación</th>
                                <th>📍 Coordenadas</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody id="tablaOrdenesBody"></tbody>
                    </table>
                </div>
            </div>
            <div class="text-muted mt-2">${filtered.length} órdenes encontradas</div>
        </div>
    `;

    // ================================================================
    //  RENDER TABLA
    // ================================================================

    const tbody = document.getElementById('tablaOrdenesBody');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:24px; color:rgba(255,255,255,0.4);">No hay órdenes con esos filtros</td></tr>`;
    } else {
        tbody.innerHTML = filtered.slice(0, 20).map(o => {
            const est = getEST(o.estado_caferedes);
            const coords = o.geolocalizacion && o.geolocalizacion.lat && o.geolocalizacion.lng
                ? `${o.geolocalizacion.lat.toFixed(4)}, ${o.geolocalizacion.lng.toFixed(4)}`
                : '—';
            
            let acciones = `<button class="btn-sm" onclick="alert('👁️ Ver detalle de ${o.orden_trabajo}')">👁️</button>`;
            if (puedeEditar) {
                acciones += ` <button class="btn-sm primary" onclick="alert('✏️ Editar ${o.orden_trabajo}')">✏️</button>`;
            }
            
            return `
                <tr>
                    <td><strong>${o.orden_trabajo}</strong></td>
                    <td>${o.direccion || '—'}</td>
                    <td>${o.nombre_suscriptor || '—'}</td>
                    <td>${o.tecnico || '—'}</td>
                    <td><span class="badge-estado est-${est}">[${est}]</span></td>
                    <td>${getEstadoBadge(o.estado_caferedes)}</td>
                    <td>${formatearFecha(o.fecha_asignacion)}</td>
                    <td style="font-family:monospace; font-size:0.6rem; color:${coords !== '—' ? '#60a5fa' : 'rgba(255,255,255,0.3)'};">${coords}</td>
                    <td style="display:flex; gap:4px; flex-wrap:wrap;">${acciones}</td>
                </tr>
            `;
        }).join('');
    }

    // ================================================================
    //  EVENTOS
    // ================================================================

    document.getElementById('btnBuscarOrdenes').addEventListener('click', function() {
        const est = document.getElementById('filtroEST').value;
        const estado = document.getElementById('filtroEstadoCaferedes').value;
        const texto = document.getElementById('filtroTextoOrdenes').value;
        const desde = document.getElementById('fechaDesde').value;
        const hasta = document.getElementById('fechaHasta').value;
        renderOrdenes(est, texto, estado, desde, hasta);
    });

    document.getElementById('btnFiltrarFechas').addEventListener('click', function() {
        const est = document.getElementById('filtroEST').value;
        const estado = document.getElementById('filtroEstadoCaferedes').value;
        const texto = document.getElementById('filtroTextoOrdenes').value;
        const desde = document.getElementById('fechaDesde').value;
        const hasta = document.getElementById('fechaHasta').value;
        renderOrdenes(est, texto, estado, desde, hasta);
    });

    document.getElementById('limpiarFiltrosOrdenes').addEventListener('click', function() {
        document.getElementById('filtroEST').value = 'TODOS';
        document.getElementById('filtroEstadoCaferedes').value = 'TODOS';
        document.getElementById('filtroTextoOrdenes').value = '';
        document.getElementById('fechaDesde').value = '';
        document.getElementById('fechaHasta').value = '';
        renderOrdenes('TODOS', '', 'TODOS', '', '');
    });

    document.getElementById('filtroEST').addEventListener('change', function() {
        const est = this.value;
        const estado = document.getElementById('filtroEstadoCaferedes').value;
        const texto = document.getElementById('filtroTextoOrdenes').value;
        const desde = document.getElementById('fechaDesde').value;
        const hasta = document.getElementById('fechaHasta').value;
        renderOrdenes(est, texto, estado, desde, hasta);
    });

    document.getElementById('filtroEstadoCaferedes').addEventListener('change', function() {
        const estado = this.value;
        const est = document.getElementById('filtroEST').value;
        const texto = document.getElementById('filtroTextoOrdenes').value;
        const desde = document.getElementById('fechaDesde').value;
        const hasta = document.getElementById('fechaHasta').value;
        
        if (estado !== 'TODOS') {
            let estEncontrado = 'TODOS';
            for (const [estKey, estados] of Object.entries(EST_A_CAFEREDES)) {
                if (estados.includes(estado)) {
                    estEncontrado = estKey;
                    break;
                }
            }
            document.getElementById('filtroEST').value = estEncontrado;
            renderOrdenes(estEncontrado, texto, estado, desde, hasta);
        } else {
            renderOrdenes(est, texto, estado, desde, hasta);
        }
    });

    document.getElementById('filtroTextoOrdenes').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const est = document.getElementById('filtroEST').value;
            const estado = document.getElementById('filtroEstadoCaferedes').value;
            const texto = this.value;
            const desde = document.getElementById('fechaDesde').value;
            const hasta = document.getElementById('fechaHasta').value;
            renderOrdenes(est, texto, estado, desde, hasta);
        }
    });

    // ===== CLICK EN ESTADÍSTICAS =====
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function() {
            const estado = this.dataset.estado;
            if (estado === 'TOTAL') {
                document.getElementById('filtroEST').value = 'TODOS';
                document.getElementById('filtroEstadoCaferedes').value = 'TODOS';
                document.getElementById('filtroTextoOrdenes').value = '';
                document.getElementById('fechaDesde').value = '';
                document.getElementById('fechaHasta').value = '';
                renderOrdenes('TODOS', '', 'TODOS', '', '');
            } else {
                document.getElementById('filtroEST').value = estado;
                document.getElementById('filtroEstadoCaferedes').value = 'TODOS';
                const texto = document.getElementById('filtroTextoOrdenes').value;
                const desde = document.getElementById('fechaDesde').value;
                const hasta = document.getElementById('fechaHasta').value;
                renderOrdenes(estado, texto, 'TODOS', desde, hasta);
            }
        });
    });

    if (typeof renderAdvantages === 'function') {
        renderAdvantages();
    }
}

console.log('✅ renderOrdenes disponible:', typeof renderOrdenes);