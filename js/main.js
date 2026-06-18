/**
 * main.js - Orquestador de la aplicación
 * ⚠️ ESTE ARCHIVO DEBE CARGARSE AL FINAL
 */

// ================================================================
//  VARIABLES GLOBALES
// ================================================================

let datos = obtenerDatos();
let usuarioActual = null;

// ================================================================
//  LOGIN / LOGOUT
// ================================================================

function login(username, password) {
    const user = USUARIOS[username];
    if (!user || user.password !== password) {
        document.getElementById('loginError').classList.add('show');
        return false;
    }

    usuarioActual = {
        username: username,
        ...user,
        id: user.id || null
    };
    window.usuarioActual = usuarioActual;

    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').style.display = 'flex';

    const avatar = document.getElementById('userAvatar');
    avatar.textContent = user.nombre.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    document.getElementById('userNameDisplay').textContent = user.nombre;
    document.getElementById('userRolDisplay').textContent = user.rol;

    renderNavTabs();
    return true;
}

function logout() {
    usuarioActual = null;
    window.usuarioActual = null;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('app').style.display = 'none';
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('loginUser').value = 'super';
    document.getElementById('loginPass').value = '123';
    
    const loginBox = document.getElementById('loginBox');
    if (loginBox) loginBox.classList.add('login-activo');
}

// ================================================================
//  NAVEGACIÓN
// ================================================================

function renderNavTabs() {
    const nav = document.getElementById('navTabs');
    const tabs = [];
    const rol = usuarioActual ? usuarioActual.rol : 'SUPER';

    if (rol === 'SUPER') {
        tabs.push({ id: 'dashboard', label: '🏠 Dashboard' });
        tabs.push({ id: 'ordenes', label: '📋 Órdenes' });
        tabs.push({ id: 'instaladores', label: '👷 Técnicos' });
        tabs.push({ id: 'configuracion', label: '⚙️ Configuración' });
        tabs.push({ id: 'perfil', label: '👤 Mi Perfil' });
    } else if (rol === 'AUXILIAR') {
        tabs.push({ id: 'dashboard', label: '🏠 Dashboard' });
        tabs.push({ id: 'ordenes', label: '📋 Órdenes' });
        tabs.push({ id: 'instaladores', label: '👷 Técnicos' });
        tabs.push({ id: 'perfil', label: '👤 Mi Perfil' });
    } else if (rol === 'INSTALADOR') {
        tabs.push({ id: 'dashboard', label: '🏠 Dashboard' });
        tabs.push({ id: 'ordenes', label: '📋 Mis Órdenes' });
        tabs.push({ id: 'perfil', label: '👤 Mi Perfil' });
    }

    nav.innerHTML = tabs.map(t =>
        `<button class="${t.id === 'dashboard' ? 'active' : ''}" data-page="${t.id}">${t.label}</button>`
    ).join('');

    document.querySelectorAll('#navTabs button').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            cambiarPagina(page);
        });
    });

    if (tabs.length > 0) {
        cambiarPagina(tabs[0].id);
    }
}

// ================================================================
//  cambiarPagina
// ================================================================

function cambiarPagina(pageId) {
    document.querySelectorAll('#navTabs button').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`#navTabs button[data-page="${pageId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    switch (pageId) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'ordenes':
            renderOrdenes('TODOS', '', '', '');
            break;
        case 'instaladores':
            renderInstaladores();
            break;
        case 'configuracion':
            if (usuarioActual && usuarioActual.rol === 'SUPER') {
                if (typeof renderConfiguracion === 'function') {
                    renderConfiguracion();
                } else {
                    renderMiPerfil();
                }
            } else {
                renderMiPerfil();
            }
            break;
        case 'perfil':
            renderMiPerfil();
            break;
        default:
            renderDashboard();
    }
}

// ================================================================
//  PERFIL
// ================================================================

function renderMiPerfil() {
    const user = usuarioActual;
    if (!user) {
        document.getElementById('mainContent').innerHTML = '<p>No hay usuario autenticado</p>';
        return;
    }
    
    const content = `
        <div class="glass-panel" style="padding:24px; max-width:500px;">
            <h3 style="margin-bottom:16px; font-weight:600;">⚙️ Mi Perfil</h3>
            <div class="detail-row"><span class="label">Usuario</span><span class="value">${user.username}</span></div>
            <div class="detail-row"><span class="label">Nombre</span><span class="value">${user.nombre}</span></div>
            <div class="detail-row"><span class="label">Rol</span><span class="value"><span class="tag">${user.rol}</span></span></div>
            <div class="detail-row"><span class="label">Contraseña</span><span class="value">••••••••</span></div>
            <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--glass-border);">
                <p class="text-muted" style="font-size:0.8rem;">🔄 Datos almacenados en LocalStorage</p>
                <p class="text-muted" style="font-size:0.8rem;">📊 Total órdenes: ${datos.ordenes.length}</p>
                <p class="text-muted" style="font-size:0.8rem;">👷 Técnicos: ${datos.instaladores.length}</p>
                <p class="text-muted" style="font-size:0.8rem;">📱 Versión mockup · CAFEREDES v3.0</p>
            </div>
        </div>
    `;
    document.getElementById('mainContent').innerHTML = content;
    renderAdvantages();
}

// ================================================================
//  RENDER ALL
// ================================================================

function renderAll() {
    datos = obtenerDatos();
    const activePage = document.querySelector('#navTabs button.active');
    if (activePage) {
        cambiarPagina(activePage.dataset.page);
    } else {
        renderDashboard();
    }
}

// ================================================================
//  INIT
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    let introCompletada = false;

    function iniciarApp() {
        if (introCompletada) return;
        introCompletada = true;

        const loginBox = document.getElementById('loginBox');
        if (loginBox) loginBox.classList.add('login-activo');

        // ===== LOGIN =====
        document.getElementById('loginBtn').addEventListener('click', function() {
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value;
            login(user, pass);
        });

        document.getElementById('loginUser').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') document.getElementById('loginBtn').click();
        });
        document.getElementById('loginPass').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') document.getElementById('loginBtn').click();
        });

        // ===== LOGOUT =====
        document.getElementById('logoutBtn').addEventListener('click', logout);

        // ===== RESET DATA =====
        document.getElementById('resetDataBtn').addEventListener('click', function() {
            if (confirm('¿Restablecer todos los datos sintéticos basados en el Excel?')) {
                const fresh = generarDatosDesdeExcel();
                guardarDatos(fresh);
                datos = fresh;
                renderAll();
                alert('✅ Datos restablecidos');
            }
        });

        // ===== MODAL =====
        document.getElementById('modalCerrar').addEventListener('click', function() {
            document.getElementById('modalDetalle').classList.remove('open');
        });
        document.getElementById('modalDetalle').addEventListener('click', function(e) {
            if (e.target === this) {
                document.getElementById('modalDetalle').classList.remove('open');
            }
        });

        // ===== ESTADO INICIAL =====
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('app').style.display = 'none';
    }

    // ===== INICIAR INTRO =====
    if (typeof iniciarIntro === 'function') {
        iniciarIntro(iniciarApp);
    } else {
        iniciarApp();
    }
});