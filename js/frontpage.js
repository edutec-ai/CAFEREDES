/**
 * frontpage.js - Módulo de Dashboard
 */

function renderDashboard() {
    const ordenes = datos.ordenes;
    const total = ordenes.length;

    const est5 = contarPorEST(ordenes, 5);
    const est7 = contarPorEST(ordenes, 7);
    const est8 = contarPorEST(ordenes, 8);

    const ordenesConCoordenadas = ordenes.filter(o => 
        o.geolocalizacion && 
        o.geolocalizacion.lat !== undefined && 
        o.geolocalizacion.lng !== undefined
    );

    let content = `
        <div class="stats-grid">
            <div class="glass-card stat-card" data-estado="TOTAL">
                <div class="stat-icon">📊</div>
                <div class="stat-value blanco">${total}</div>
                <div class="stat-label">Total órdenes</div>
            </div>
            <div class="glass-card stat-card" data-estado="5">
                <div class="stat-icon">🟡</div>
                <div class="stat-value amarillo">${est5}</div>
                <div class="stat-label">Generadas [5]</div>
            </div>
            <div class="glass-card stat-card" data-estado="7">
                <div class="stat-icon">🔵</div>
                <div class="stat-value azul">${est7}</div>
                <div class="stat-label">Intervenidas [7]</div>
            </div>
            <div class="glass-card stat-card" data-estado="8">
                <div class="stat-icon">🟢</div>
                <div class="stat-value verde">${est8}</div>
                <div class="stat-label">Revisadas [8]</div>
            </div>
        </div>
        <div style="display:grid; grid-template-columns:1.6fr 1.4fr; gap:20px;">
            <div class="glass-panel" style="padding:20px;">
                <div class="flex-between" style="margin-bottom:12px;">
                    <h4 style="font-weight:600; font-size:1rem;">📋 Últimas órdenes</h4>
                    <span class="text-muted">últimas 6</span>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th style="width:15%;">OT</th>
                                <th style="width:35%;">Dirección</th>
                                <th style="width:25%;">Estado</th>
                                <th style="width:25%;">📍 Coordenadas</th>
                            </tr>
                        </thead>
                        <tbody id="ultimasOrdenes"></tbody>
                    </table>
                </div>
            </div>
            <div class="glass-panel" style="padding:20px;">
                <div class="flex-between" style="margin-bottom:12px;">
                    <h4 style="font-weight:600; font-size:1rem;">📍 Georreferenciación</h4>
                    <span class="text-muted">${ordenesConCoordenadas.length} con ubicación</span>
                </div>
                <div class="map-mockup">
                    <div class="map-floating-card">
                        📍 ${ordenesConCoordenadas.length} órdenes con ubicación
                    </div>
                    ${ordenesConCoordenadas.length > 0 ? ordenesConCoordenadas.slice(0, 10).map((o, i) => {
                        const lat = o.geolocalizacion.lat;
                        const lng = o.geolocalizacion.lng;
                        const top = 15 + ((lat - 4.60) / 0.20) * 70;
                        const left = 15 + ((lng + 74.15) / 0.20) * 70;
                        const colors = ['#ef4444', '#2563eb', '#f59e0b', '#22c55e', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
                        const color = colors[i % colors.length];
                        let icon = '📍';
                        if (o.estado_caferedes === 'LEGALIZADA') icon = '✅';
                        else if (o.estado_caferedes === 'ASIGNADA') icon = '📌';
                        else if (o.estado_caferedes === 'BLOQUEADA') icon = '🚫';
                        else if (o.estado_caferedes === 'ENVIADA A OIA') icon = '📤';
                        else if (o.estado_caferedes === 'PROGRAMADA') icon = '📅';
                        return `<div class="map-pin" style="top: ${Math.min(92, Math.max(8, top))}%; left: ${Math.min(92, Math.max(8, left))}%; color: ${color};" title="${o.orden_trabajo}">${icon}</div>`;
                    }).join('') : '<div style="display:flex; align-items:center; justify-content:center; height:200px; color:rgba(255,255,255,0.3); font-size:0.9rem;">Sin órdenes con ubicación</div>'}
                </div>
            </div>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = content;

    // Click en tarjetas
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function() {
            const estado = this.dataset.estado;
            if (estado === 'TOTAL') {
                cambiarPagina('ordenes');
            } else {
                cambiarPagina('ordenes');
                setTimeout(() => {
                    const select = document.getElementById('filtroEST');
                    if (select) {
                        select.value = estado;
                        select.dispatchEvent(new Event('change'));
                    }
                }, 100);
            }
        });
    });

    // Últimas órdenes
    const tbody = document.getElementById('ultimasOrdenes');
    if (!tbody) return;
    
    const top6 = ordenes.slice(0, 6);
    if (top6.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:rgba(255,255,255,0.3);">No hay órdenes registradas</td></tr>`;
    } else {
        tbody.innerHTML = top6.map(o => {
            const coords = o.geolocalizacion && o.geolocalizacion.lat && o.geolocalizacion.lng
                ? `${o.geolocalizacion.lat.toFixed(4)}, ${o.geolocalizacion.lng.toFixed(4)}`
                : '—';
            const direccion = o.direccion && o.direccion.length > 35 
                ? o.direccion.substring(0, 35) + '...' 
                : o.direccion || '—';
            return `
                <tr>
                    <td><strong>${o.orden_trabajo || '—'}</strong></td>
                    <td><span title="${o.direccion || ''}">${direccion}</span></td>
                    <td>${o.estado_caferedes ? getEstadoBadge(o.estado_caferedes) : '—'}</td>
                    <td style="font-family:monospace; font-size:0.7rem; color:${coords !== '—' ? '#60a5fa' : 'rgba(255,255,255,0.3)'};">${coords}</td>
                </tr>
            `;
        }).join('');
    }

    renderAdvantages();
}

function renderAdvantages() {
    const container = document.getElementById('advantagesRow');
    if (!container) return;
    
    const user = window.usuarioActual || null;
    const rol = user ? user.rol : 'SUPER';
    
    const ventajas = {
        SUPER: [
            { icon: '👑', text: 'Control total del negocio' },
            { icon: '📊', text: 'Datos en tiempo real' },
            { icon: '⚡', text: 'Toma de decisiones' },
            { icon: '🛡️', text: 'Supervisión completa' }
        ],
        AUXILIAR: [
            { icon: '👥', text: 'Gestión de equipo' },
            { icon: '📋', text: 'Operaciones totales' },
            { icon: '📦', text: 'Inventario' },
            { icon: '📊', text: 'Reportes ejecutivos' }
        ],
        INSTALADOR: [
            { icon: '📱', text: 'Mis órdenes organizadas' },
            { icon: '✅', text: 'Cambio de estados' },
            { icon: '📊', text: 'Mi rendimiento' },
            { icon: '📍', text: 'Planificación de rutas' }
        ]
    };

    const items = ventajas[rol] || ventajas.SUPER;
    container.innerHTML = items.map(v =>
        `<div class="glass-panel adv-card"><span class="adv-icon">${v.icon}</span><span class="adv-text">${v.text}</span></div>`
    ).join('');
}