/**
 * configuracion.js - Módulo de Configuración (solo SUPER)
 */

function renderConfiguracion() {
    const config = obtenerConfiguracion();

    const content = `
        <div class="glass-panel" style="padding:24px; max-width:600px;">
            <h3 style="margin-bottom:20px; font-weight:600;">⚙️ Configuración del Sistema</h3>
            
            <div style="margin-bottom:24px; padding:16px; background:rgba(255,255,255,0.04); border-radius:12px; border:1px solid var(--glass-border);">
                <h4 style="margin-bottom:12px; font-size:0.95rem;">📍 Georreferenciación</h4>
                
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                    <div>
                        <span style="font-weight:500;">Habilitar geolocalización</span>
                        <p style="font-size:0.75rem; color:rgba(255,255,255,0.5); margin-top:2px;">
                            Permite capturar coordenadas GPS en las intervenciones
                        </p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="toggleGeolocalizacion" ${config.georreferenciacion.habilitada ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:8px;">
                    <div>
                        <label style="display:block; font-size:0.75rem; color:rgba(255,255,255,0.5); margin-bottom:4px;">Órdenes con ubicación</label>
                        <span style="font-size:1.2rem; font-weight:600;">${datos.ordenes.filter(o => o.geolocalizacion).length}</span>
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; color:rgba(255,255,255,0.5); margin-bottom:4px;">Sin ubicación</label>
                        <span style="font-size:1.2rem; font-weight:600;">${datos.ordenes.filter(o => !o.geolocalizacion).length}</span>
                    </div>
                </div>
            </div>

            <div style="padding:16px; background:rgba(255,255,255,0.04); border-radius:12px; border:1px solid var(--glass-border);">
                <h4 style="margin-bottom:8px; font-size:0.95rem;">📊 Estado del sistema</h4>
                <p class="text-muted" style="font-size:0.8rem;">Total órdenes: ${datos.ordenes.length}</p>
                <p class="text-muted" style="font-size:0.8rem;">Técnicos activos: ${datos.instaladores.filter(i => i.activo !== false).length}</p>
                <p class="text-muted" style="font-size:0.8rem;">Almacenamiento: LocalStorage</p>
                <p class="text-muted" style="font-size:0.8rem;">Versión: GasNet v3.0</p>
            </div>

            <div style="margin-top:20px; text-align:right;">
                <button class="btn-sm primary" id="guardarConfiguracion">💾 Guardar cambios</button>
            </div>
        </div>
    `;

    document.getElementById('mainContent').innerHTML = content;

    document.getElementById('guardarConfiguracion').addEventListener('click', function() {
        const habilitada = document.getElementById('toggleGeolocalizacion').checked;
        guardarConfiguracion({ georreferenciacion: { habilitada: habilitada } });
        
        const btn = this;
        const originalText = btn.textContent;
        btn.textContent = '✅ Guardado';
        btn.style.background = 'rgba(22, 163, 74, 0.2)';
        btn.style.borderColor = 'rgba(22, 163, 74, 0.3)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
        }, 2000);
    });

    renderAdvantages();
}

function obtenerConfiguracion() {
    const stored = localStorage.getItem('gasnet_config');
    if (stored) {
        try { return JSON.parse(stored); } catch (e) { /* fallback */ }
    }
    return { georreferenciacion: { habilitada: true } };
}

function guardarConfiguracion(config) {
    localStorage.setItem('gasnet_config', JSON.stringify(config));
}