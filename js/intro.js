/**
 * intro.js - Módulo de animación de introducción
 */

function iniciarIntro(onIntroFinalizada) {
    const logo = document.getElementById('logoGasNet');
    const titulo = document.getElementById('tituloGasNet');
    const subtitulo = document.getElementById('subtituloGasNet');
    const loader = document.getElementById('introLoader');
    const overlay = document.getElementById('introOverlay');
    const loginBox = document.getElementById('loginBox');

    if (!logo || !titulo || !overlay) {
        if (overlay) overlay.style.display = 'none';
        if (loginBox) loginBox.classList.add('login-activo');
        if (typeof onIntroFinalizada === 'function') onIntroFinalizada();
        return;
    }

    overlay.style.display = 'flex';
    overlay.classList.remove('cortina-oculta');
    logo.classList.remove('logo-visible');
    titulo.classList.remove('texto-visible');
    if (subtitulo) subtitulo.classList.remove('texto-visible');
    if (loader) loader.classList.remove('loader-complete');

    setTimeout(() => {
        logo.classList.add('logo-visible');
        setTimeout(() => {
            titulo.classList.add('texto-visible');
            setTimeout(() => {
                if (subtitulo) subtitulo.classList.add('texto-visible');
                setTimeout(() => {
                    if (loader) loader.classList.add('loader-complete');
                    setTimeout(() => {
                        overlay.classList.add('cortina-oculta');
                        setTimeout(() => {
                            overlay.style.display = 'none';
                            if (loginBox) loginBox.classList.add('login-activo');
                            if (typeof onIntroFinalizada === 'function') {
                                onIntroFinalizada();
                            }
                        }, 700);
                    }, 800);
                }, 600);
            }, 500);
        }, 700);
    }, 300);
}