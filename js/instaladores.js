/**
 * instaladores.js - Módulo de Técnicos/Instaladores
 */

function renderInstaladores() {
    const content = `
        <div class="flex-between" style="margin-bottom:12px;">
            <h4 style="font-weight:600; font-size:1rem;">👷 Técnicos / Instaladores</h4>
            <span class="text-muted">${datos.instaladores.filter(i => i.activo !== false).length} activos</span>
        </div>
        <div id="listaInstaladores"></div>
    `;

    document.getElementById('mainContent').innerHTML = content;

    const container = document.getElementById('listaInstaladores');
    const user = window.usuarioActual || null;
    const puedeEditar = user && (user.rol === 'SUPER' || user.rol === 'AUXILIAR');

    container.innerHTML = datos.instaladores.map(inst => {
        const ordenesCount = datos.ordenes.filter(o => o.tecnico === inst.nombre).length;
        return `
            <div class="glass-panel" style="padding:14px 18px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                    <span style="font-weight:600;">${inst.nombre}</span>
                    <span style="font-size:0.75rem; color:rgba(255,255,255,0.5);">${inst.especialidad}</span>
                    <span style="font-size:0.75rem; color:rgba(255,255,255,0.5);">📞 ${inst.telefono}</span>
                    ${inst.activo !== false ? '<span class="tag" style="border-color: rgba(22,163,74,0.3); color:#4ade80;">✅ Activo</span>' : '<span class="tag" style="border-color: rgba(220,38,38,0.3); color:#f87171;">⛔ Inactivo</span>'}
                </div>
                <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                    <span class="text-muted">${ordenesCount} órdenes</span>
                    ${puedeEditar ? `<button class="btn-sm primary" onclick="alert('Editar ${inst.nombre}')">✏️</button>` : ''}
                    ${puedeEditar ? `<button class="btn-sm ${inst.activo !== false ? 'warning' : 'success'}" onclick="alert('Toggle ${inst.nombre}')">${inst.activo !== false ? '⛔' : '✅'}</button>` : ''}
                </div>
            </div>
        `;
    }).join('');

    renderAdvantages();
}