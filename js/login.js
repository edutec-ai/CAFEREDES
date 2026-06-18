/**
 * login.js - Módulo de autenticación (FUNCIONES AUXILIARES)
 * Las variables globales (usuarioActual) están en main.js
 */

// ================================================================
//  FUNCIONES DE UTILIDAD PARA VERIFICAR PERMISOS
// ================================================================

function getUsuarioActual() {
    // Esta función retorna la variable global usuarioActual desde main.js
    return window.usuarioActual || null;
}

function esSuper() {
    const user = getUsuarioActual();
    return user && user.rol === 'SUPER';
}

function esAuxiliar() {
    const user = getUsuarioActual();
    return user && user.rol === 'AUXILIAR';
}

function esInstalador() {
    const user = getUsuarioActual();
    return user && user.rol === 'INSTALADOR';
}

function puedeEditarOrden(orden) {
    const user = getUsuarioActual();
    if (!user) return false;
    if (user.rol === 'SUPER' || user.rol === 'AUXILIAR') return true;
    if (user.rol === 'INSTALADOR' && orden.tecnico === user.nombre) return true;
    return false;
}

function puedeVerTecnicos() {
    const user = getUsuarioActual();
    return user && (user.rol === 'SUPER' || user.rol === 'AUXILIAR');
}

function puedeVerConsultas() {
    const user = getUsuarioActual();
    return user && (user.rol === 'SUPER' || user.rol === 'AUXILIAR');
}