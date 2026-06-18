/**
 * recursos.js - Módulo de Consultas (actualizado con mismos filtros que Órdenes)
 */

function renderConsultas() {
    // Obtener estados únicos para el filtro
    const estadosUnicos = [...new Set(datos.ordenes.map(o => o.estado_caferedes))].filter(Boolean).sort();

    const content = `
        <div class="glass-panel" style="padding:20px;">
            <h4 style="font-weight:600; font-size:1rem; margin-bottom:12px;">📊 Consultas Rápidas</h4>
            
            <!-- ===== FILTROS (igual que en Órdenes) ===== -->
            <div class="filters-row" style="margin-bottom:16px;">
                <label>Filtrar por EST:</label>
                <select id="filtroConsultaEST">
                    <option value="TODOS">Todos</option>
                    <option value="5">Generadas [5]</option>
                    <option value="7">Intervenidas [7]</option>
                    <option value="8">Revisadas [8]</option>
                </select>
                
                <label>Estado CAFEREDES:</label>
                <select id="filtroConsultaEstado">
                    <option value="TODOS">Todos</option>
                    ${estadosUnicos.map(e => `<option value="${e}">${getEstadoLabel(e)}</option>`).join('')}
                </select>
                
                <label>Buscar:</label>
                <input type="text" id="filtroConsultaTexto" placeholder="OT, dirección, cliente..." style="min-width:180px;">
                
                <button class="btn-sm primary" id="btnConsultar">🔍 Consultar</button>
                <button class="btn-sm" id="limpiarFiltrosConsulta">Limpiar</button>
            </div>
            
            <!-- ===== FECHAS (adicional) ===== -->
            <div class="filters-row" style="margin-bottom:16px; border-top:1px solid var(--glass-border); padding-top:12px;">
                <label>📅 Rango de fechas (asignación):</label>
                <input type="date" id="fechaDesde" style="min-width:140px;">
                <label>hasta</label>
                <input type="date" id="fechaHasta" style="min-width:140px;">
                <span class="text-muted" style="font-size:0.65rem;">Opcional</span>
            </div>

            <!-- ===== RESULTADOS ===== -->
            <div id="resultadoConsulta" style="margin-top:12px;">
                <div class="stats-grid" id="consultaStats" style="grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); margin-bottom:12px;"></div>
                <div class="glass-panel" style="padding:4px 0;">
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>OT</th>
                                    <th>Dirección</th>
                                    <th>EST</th>
                                    <th>Estado</th>
                                    <th>Técnico</th>
                                    <th>F. Asignación</th>
                                    <th>📍 Coordenadas</th>
                                </tr>
                            </thead>
                            <tbody id="consultaTabla"></tbody>
                        </table>
                    </div>
                </div>
                <div class="text-muted mt-2" id="consultaContador">0 órdenes encontradas</div>
            </div>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = content;

    // ===== EVENTOS =====
    document.getElementById('btnConsultar').addEventListener('click', function() {
        ejecutarConsulta();
    });

    document.getElementById('limpiarFiltrosConsulta').addEventListener('click', function() {
        document.getElementById('filtroConsultaEST').value = 'TODOS';
        document.getElementById('filtroConsultaEstado').value = 'TODOS';
        document.getElementById('filtroConsultaTexto').value = '';
        document.getElementById('fechaDesde').value = '';
        document.getElementById('fechaHasta').value = '';
        ejecutarConsulta();
    });

    // Enter en el campo de búsqueda
    document.getElementById('filtroConsultaTexto').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') ejecutarConsulta();
    });

    // Cargar consulta inicial
    ejecutarConsulta();
    renderAdvantages();
}

// ================================================================
//  EJECUTAR CONSULTA (con los mismos filtros que Órdenes)
// ================================================================

function ejecutarConsulta() {
    let filtradas = datos.ordenes;

    // ===== FILTRO POR EST =====
    const filtroEST = document.getElementById('filtroConsultaEST').value;
    if (filtroEST !== 'TODOS') {
        const est = parseInt(filtroEST);
        const estados = EST_A_CAFEREDES[est] || [];
        filtradas = filtradas.filter(o => estados.includes(o.estado_caferedes));
    }

    // ===== FILTRO POR ESTADO CAFEREDES =====
    const filtroEstado = document.getElementById('filtroConsultaEstado').value;
    if (filtroEstado !== 'TODOS') {
        filtradas = filtradas.filter(o => o.estado_caferedes === filtroEstado);
    }

    // ===== FILTRO POR TEXTO (buscar en OT, dirección, cliente, técnico) =====
    const filtroTexto = document.getElementById('filtroConsultaTexto').value.trim().toLowerCase();
    if (filtroTexto) {
        filtradas = filtradas.filter(o =>
            o.orden_trabajo.toLowerCase().includes(filtroTexto) ||
            o.direccion.toLowerCase().includes(filtroTexto) ||
            o.nombre_suscriptor.toLowerCase().includes(filtroTexto) ||
            (o.tecnico && o.tecnico.toLowerCase().includes(filtroTexto))
        );
    }

    // ===== FILTRO POR FECHAS =====
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;
    if (fechaDesde) {
        filtradas = filtradas.filter(o => o.fecha_asignacion && o.fecha_asignacion >= fechaDesde);
    }
    if (fechaHasta) {
        filtradas = filtradas.filter(o => o.fecha_asignacion && o.fecha_asignacion <= fechaHasta);
    }

    // ===== ACTUALIZAR ESTADÍSTICAS =====
    const total = filtradas.length;
    const est5 = filtradas.filter(o => EST_A_CAFEREDES[5].includes(o.estado_caferedes)).length;
    const est7 = filtradas.filter(o => EST_A_CAFEREDES[7].includes(o.estado_caferedes)).length;
    const est8 = filtradas.filter(o => EST_A_CAFEREDES[8].includes(o.estado_caferedes)).length;

    document.getElementById('consultaStats').innerHTML = `
        <div class="glass-card stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value blanco">${total}</div>
            <div class="stat-label">Total</div>
        </div>
        <div class="glass-card stat-card">
            <div class="stat-icon">🟡</div>
            <div class="stat-value amarillo">${est5}</div>
            <div class="stat-label">Gen [5]</div>
        </div>
        <div class="glass-card stat-card">
            <div class="stat-icon">🔵</div>
            <div class="stat-value azul">${est7}</div>
            <div class="stat-label">Int [7]</div>
        </div>
        <div class="glass-card stat-card">
            <div class="stat-icon">🟢</div>
            <div class="stat-value verde">${est8}</div>
            <div class="stat-label">Rev [8]</div>
        </div>
    `;

    // ===== ACTUALIZAR TABLA =====
    const tbody = document.getElementById('consultaTabla');
    const contador = document.getElementById('consultaContador');
    
    if (!tbody) return;
    contador.textContent = `${filtradas.length} órdenes encontradas`;

    if (filtradas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:rgba(255,255,255,0.4);">No hay órdenes que cumplan los filtros</td></tr>`;
        return;
    }

    tbody.innerHTML = filtradas.slice(0, 100).map(o => {
        const estNum = getEST(o.estado_caferedes);
        const direccion = o.direccion && o.direccion.length > 30 
            ? o.direccion.substring(0, 30) + '...' 
            : o.direccion || '—';
        
        const coords = o.geolocalizacion && o.geolocalizacion.lat && o.geolocalizacion.lng
            ? `${o.geolocalizacion.lat.toFixed(4)}, ${o.geolocalizacion.lng.toFixed(4)}`
            : '—';
        
        return `
            <tr>
                <td><strong>${o.orden_trabajo}</strong></td>
                <td><span title="${o.direccion || ''}">${direccion}</span></td>
                <td><span class="badge-estado est-${estNum}">[${estNum}]</span></td>
                <td>${getEstadoBadge(o.estado_caferedes)}</td>
                <td>${o.tecnico || '—'}</td>
                <td>${formatearFecha(o.fecha_asignacion)}</td>
                <td style="font-family:monospace; font-size:0.6rem; color:${coords !== '—' ? '#60a5fa' : 'rgba(255,255,255,0.3)'};">${coords}</td>
            </tr>
        `;
    }).join('');
}