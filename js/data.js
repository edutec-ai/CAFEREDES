/**
 * data.js - Módulo de datos
 * Gestión de datos del Excel, LocalStorage y operaciones CRUD
 * ⚠️ ESTE ARCHIVO DEBE CARGARSE PRIMERO
 */

// ================================================================
//  MAPEO DE ESTADOS CON EST={5,7,8}
// ================================================================

const ESTADOS_CAFEREDES = {
    'REGISTRADO': { label: 'Registrado [5]', cls: 'est-5' },
    'ASIGNADA': { label: 'Asignada [5]', cls: 'est-5' },
    'PROGRAMADA': { label: 'Programada [5]', cls: 'est-5' },
    'Pendiente Instalacion': { label: 'Pendiente Instalación [5]', cls: 'est-5' },
    'Activo': { label: 'Activo [5]', cls: 'est-5' },
    'ENVIADA A OIA': { label: 'Enviada a OIA [7]', cls: 'est-7' },
    'BLOQUEADA': { label: 'Bloqueada [7]', cls: 'est-7' },
    'CONSTRUIDA': { label: 'Construida [7]', cls: 'est-7' },
    'LEGALIZADA': { label: 'Legalizada [8]', cls: 'est-8' },
    'RECHAZADA POR OIA': { label: 'Rechazada OIA [8]', cls: 'est-8' },
    'RECHAZADA': { label: 'Rechazada [8]', cls: 'est-8' }
};

const EST_A_CAFEREDES = {
    5: ['REGISTRADO', 'ASIGNADA', 'PROGRAMADA', 'Pendiente Instalacion', 'Activo'],
    7: ['ENVIADA A OIA', 'BLOQUEADA', 'CONSTRUIDA'],
    8: ['LEGALIZADA', 'RECHAZADA POR OIA', 'RECHAZADA']
};

const USUARIOS = {
    super: { password: '123', rol: 'SUPER', nombre: 'Gerente General' },
    auxiliar: { password: '123', rol: 'AUXILIAR', nombre: 'Asistente Operativo' },
    instalador: { password: '123', rol: 'INSTALADOR', nombre: 'Instalador de Campo' }
};

// ================================================================
//  GENERAR DATOS DESDE EXCEL
// ================================================================

function generarDatosDesdeExcel() {
    const tecnicos = [
        { nombre: 'JOAQUIN', especialidad: 'Instalaciones residenciales', telefono: '3101234567' },
        { nombre: 'GERMAN', especialidad: 'Instalaciones residenciales', telefono: '3102345678' },
        { nombre: 'JUAN DE CRUZ', especialidad: 'Instalaciones residenciales', telefono: '3103456789' },
        { nombre: 'OSCAR', especialidad: 'Instalaciones residenciales', telefono: '3104567890' },
        { nombre: 'LLOREDA', especialidad: 'Instalaciones comerciales', telefono: '3105678901' },
        { nombre: 'PETRO', especialidad: 'Instalaciones residenciales', telefono: '3106789012' },
        { nombre: 'CLEO', especialidad: 'Instalaciones residenciales', telefono: '3107890123' },
        { nombre: 'CRISTIAN', especialidad: 'Instalaciones residenciales', telefono: '3108901234' },
        { nombre: 'CARLOS MARIO', especialidad: 'Instalaciones residenciales', telefono: '3109012345' },
        { nombre: 'WILFRAN', especialidad: 'Instalaciones residenciales', telefono: '3110123456' },
        { nombre: 'PATIÑO', especialidad: 'Instalaciones comerciales', telefono: '3111234567' },
        { nombre: 'JHON FREDDY', especialidad: 'Instalaciones residenciales', telefono: '3112345678' },
        { nombre: 'FREDY MARTINEZ', especialidad: 'Instalaciones residenciales', telefono: '3113456789' },
        { nombre: 'ROLO', especialidad: 'Instalaciones residenciales', telefono: '3114567890' },
        { nombre: 'JADER PETRO', especialidad: 'Instalaciones residenciales', telefono: '3115678901' }
    ];

    const instaladores = tecnicos.map((t, idx) => ({
        id: `INS-${String(idx + 1).padStart(3, '0')}`,
        nombre: t.nombre,
        telefono: t.telefono,
        especialidad: t.especialidad,
        estado: ['disponible', 'ocupado', 'descanso'][Math.floor(Math.random() * 3)],
        activo: true
    }));

    const auxiliares = [
        { id: 'AUX-001', nombre: 'Laura Gómez', email: 'laura@ei.com', activo: true },
        { id: 'AUX-002', nombre: 'Pedro Sánchez', email: 'pedro@ei.com', activo: true },
        { id: 'AUX-003', nombre: 'Ana María Pérez', email: 'ana@ei.com', activo: true }
    ];

    // Coordenadas de Pereira
    const coordenadas = [
        { lat: 4.7110, lng: -74.0721 },
        { lat: 4.8120, lng: -74.0521 },
        { lat: 4.6120, lng: -74.0921 },
        { lat: 4.7110, lng: -74.0521 },
        { lat: 4.7110, lng: -74.0921 },
        { lat: 4.6520, lng: -74.0621 },
        { lat: 4.7620, lng: -74.0821 },
        { lat: 4.6820, lng: -74.0721 },
        { lat: 4.7210, lng: -74.0621 },
        { lat: 4.7010, lng: -74.0821 }
    ];

    const ordenesBase = [
        {
            orden_trabajo: '123194323',
            estado_caferedes: 'REGISTRADO',
            descripcion_tipo_trabajo: 'CONSTRUCCION DE INSTALACION INTERNA RESIDENCIAL',
            direccion: 'CL 63 KR 14 - 80 TORRE 1 APTO 303',
            barrio: 'BARRIO ALCAZARES',
            nombre_suscriptor: 'CONSTRUCTORA PROMETEO S.A.S',
            telefono: '3165270726',
            tecnico: null,
            fecha_asignacion: '2022-01-24',
            fecha_legalizacion: null,
            contrato: '1266664',
            solicitud: '59569367',
            descripcion_solicitud: 'Venta a Constructoras',
            subcategoria: 'CONSTRUCTORAS',
            comentario: 'OFERTA COMERCIAL DE CONSTRUCCIÓN DE 80 REDES INTERNAS',
            items: null
        },
        {
            orden_trabajo: '130626078',
            estado_caferedes: 'REGISTRADO',
            descripcion_tipo_trabajo: 'CONSTRUCCION DE INSTALACION INTERNA COMERCIAL',
            direccion: 'VIA CERRITOS CC CERRITOS MALL LOCAL 240A',
            barrio: 'VEREDA CERRITOS',
            nombre_suscriptor: 'CERRITOS CONSTRUCCIONES S.A.S.',
            telefono: '3171616',
            tecnico: null,
            fecha_asignacion: '2022-06-24',
            fecha_legalizacion: null,
            contrato: '1304045',
            solicitud: '63458152',
            descripcion_solicitud: 'Venta a Constructoras',
            subcategoria: 'CONSTRUCTORAS',
            comentario: 'OFERTA SI PARA 98 REDES Y 01 DERECHO POR CONEXIÓN',
            items: null
        },
        {
            orden_trabajo: '202804908',
            estado_caferedes: 'LEGALIZADA',
            descripcion_tipo_trabajo: 'CONSTRUCCION DE INSTALACION INTERNA RESIDENCIAL',
            direccion: 'CL 96 KR 17 - 110 TORRE 5 PISO 1 APTO 103',
            barrio: 'CONJ RESD BRISAS DE BELMONTE',
            nombre_suscriptor: 'CONSTRUCTORA LAS GALIAS S.A.S',
            telefono: '3116173688',
            tecnico: 'cleobulo',
            fecha_asignacion: '2026-03-16',
            fecha_legalizacion: '2026-06-10',
            contrato: '1589436',
            solicitud: '135657646',
            descripcion_solicitud: 'Venta a Constructoras',
            subcategoria: 'CONSTRUCTORAS',
            comentario: 'OFERTA COMERCIAL PARA 40 S.I A 2 PTOS',
            items: '4973*1-5737*1-6743*1'
        },
        {
            orden_trabajo: '203002537',
            estado_caferedes: 'LEGALIZADA',
            descripcion_tipo_trabajo: 'CARGO POR CONEXIÓN RESIDENCIAL',
            direccion: 'VEREDA LA ESPERANZA MZ 2388 NUPR 33',
            barrio: 'VEREDA LA ESPERANZA',
            nombre_suscriptor: 'ALBEIRO DE JESUS AGUDELO NAVARRO',
            telefono: '3234068403',
            tecnico: 'JOAQUIN',
            fecha_asignacion: '2026-05-15',
            fecha_legalizacion: '2026-06-13',
            contrato: '1529615',
            solicitud: '113304411',
            descripcion_solicitud: 'Venta de Gas Cotizada',
            subcategoria: 'ESTRATO 2',
            comentario: 'PC 26 VTA RESI COTIZA CON REVISION',
            items: '5018*1-4996*1-4942*2-4941*1'
        },
        {
            orden_trabajo: '203171993',
            estado_caferedes: 'ENVIADA A OIA',
            descripcion_tipo_trabajo: 'CARGO POR CONEXIÓN RESIDENCIAL',
            direccion: 'POBLADO II - MZ 26 CASA 17 APTO 301',
            barrio: 'POBLADO II',
            nombre_suscriptor: 'GUSTAVO ADOLFO TRUJILLO',
            telefono: '3113042612',
            tecnico: 'JOAQUIN',
            fecha_asignacion: '2026-04-20',
            fecha_legalizacion: null,
            contrato: '1554525',
            solicitud: '123472754',
            descripcion_solicitud: 'Venta de Gas por Formulario',
            subcategoria: 'ESTRATO 3',
            comentario: 'PLAN COMERCIAL: 100-PRECIO 2 Y 3 PISO 2PUNTOS',
            items: '5018*1-4947*1-4988*3-4952*1'
        }
    ];

    const ordenes = [];
    const estadosCaferedes = ['LEGALIZADA', 'ASIGNADA', 'ENVIADA A OIA', 'BLOQUEADA', 'RECHAZADA POR OIA', 'PROGRAMADA', 'CONSTRUIDA', 'REGISTRADO'];
    const tiposTrabajo = ['CONSTRUCCION DE INSTALACION INTERNA RESIDENCIAL', 'CARGO POR CONEXIÓN RESIDENCIAL', 'CONSTRUCCION DE INSTALACION INTERNA COMERCIAL'];
    const suscriptores = ['CONSTRUCTORA PROMETEO S.A.S', 'CERRITOS CONSTRUCCIONES S.A.S.', 'CÚPULA S.A', 'CONSTRUCTORA LAS GALIAS S.A.S', 'CONDINA CONSTRUCCIONES S.A.S'];
    const barrios = ['BARRIO ALCAZARES', 'VEREDA CERRITOS', 'GALICIA', 'CONJUNTO RESIDENCIAL SIDERAL', 'SAMARIA II', 'SAN MARCOS'];
    const direcciones = [
        'CL 63 KR 14 - 80 TORRE 1 APTO 303',
        'VIA CERRITOS CC CERRITOS MALL LOCAL 240A',
        'VEREDA FONDA CENTRAL TORRE 3 APTO 1114',
        'CL 96 KR 17 - 110 TORRE 5 PISO 1 APTO 103',
        'KR 36 CL 87 - 15 TORRE 5 APTO 101',
        'KR 34B CL 28 - 50 TORRE 1 APTO 1305'
    ];

    // ===== ASIGNAR COORDENADAS A ÓRDENES BASE =====
    ordenesBase.forEach((o, idx) => {
        const coord = coordenadas[idx % coordenadas.length];
        o.geolocalizacion = {
            lat: coord.lat + (Math.random() - 0.5) * 0.01,
            lng: coord.lng + (Math.random() - 0.5) * 0.01
        };
        // Calcular estado_orden basado en estado_caferedes
        o.estado_orden = 5;
        if (['LEGALIZADA', 'RECHAZADA POR OIA', 'RECHAZADA'].includes(o.estado_caferedes)) o.estado_orden = 8;
        else if (['ENVIADA A OIA', 'BLOQUEADA', 'CONSTRUIDA'].includes(o.estado_caferedes)) o.estado_orden = 7;
        ordenes.push({ ...o });
    });

    // ===== GENERAR ÓRDENES ADICIONALES =====
    const tecnicosList = tecnicos.map(t => t.nombre);
    for (let i = 0; i < 25; i++) {
        const estado = estadosCaferedes[Math.floor(Math.random() * estadosCaferedes.length)];
        let estadoOrden = 5;
        if (['LEGALIZADA', 'RECHAZADA POR OIA', 'RECHAZADA'].includes(estado)) estadoOrden = 8;
        else if (['ENVIADA A OIA', 'BLOQUEADA', 'CONSTRUIDA'].includes(estado)) estadoOrden = 7;
        
        const fechaAsignacion = new Date(2025, 10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1);
        const fechaLegalizacion = estado === 'LEGALIZADA' ? new Date(fechaAsignacion.getTime() + (Math.floor(Math.random() * 30) + 10) * 86400000) : null;
        const tecnico = Math.random() > 0.4 ? tecnicosList[Math.floor(Math.random() * tecnicosList.length)] : null;
        const coord = coordenadas[Math.floor(Math.random() * coordenadas.length)];

        ordenes.push({
            orden_trabajo: `OT-${2025 + Math.floor(i/10)}-${String(10000 + i + 1).padStart(5, '0')}`,
            estado_orden: estadoOrden,
            estado_caferedes: estado,
            descripcion_tipo_trabajo: tiposTrabajo[Math.floor(Math.random() * tiposTrabajo.length)],
            direccion: direcciones[Math.floor(Math.random() * direcciones.length)],
            barrio: barrios[Math.floor(Math.random() * barrios.length)],
            nombre_suscriptor: suscriptores[Math.floor(Math.random() * suscriptores.length)],
            telefono: `3${String(Math.floor(Math.random()*900000000)+100000000)}`,
            tecnico: tecnico,
            fecha_asignacion: fechaAsignacion.toISOString().slice(0, 10),
            fecha_legalizacion: fechaLegalizacion ? fechaLegalizacion.toISOString().slice(0, 10) : null,
            contrato: String(Math.floor(Math.random() * 2000000) + 1000000),
            solicitud: String(Math.floor(Math.random() * 90000000) + 10000000),
            descripcion_solicitud: ['Venta a Constructoras', 'Venta de Gas Cotizada', 'Venta de Gas por Formulario'][Math.floor(Math.random() * 3)],
            subcategoria: ['CONSTRUCTORAS', 'ESTRATO 3', 'ESTRATO 2', 'ESTRATO 1', 'ESTRATO 4'][Math.floor(Math.random() * 5)],
            comentario: `OFERTA COMERCIAL PARA ${Math.floor(Math.random()*100)+10} S.I`,
            items: Math.random() > 0.7 ? `5018*${Math.floor(Math.random()*5)+1}-4996*${Math.floor(Math.random()*3)+1}` : null,
            geolocalizacion: {
                lat: coord.lat + (Math.random() - 0.5) * 0.01,
                lng: coord.lng + (Math.random() - 0.5) * 0.01
            }
        });
    }

    return { instaladores, auxiliares, ordenes };
}

// ================================================================
//  GESTIÓN DE DATOS
// ================================================================

function obtenerDatos() {
    const stored = localStorage.getItem('gasnet_data_glass');
    if (stored) {
        try { 
            const parsed = JSON.parse(stored);
            // Asegurar que todas las órdenes tengan geolocalización
            parsed.ordenes.forEach(o => {
                if (!o.geolocalizacion) {
                    const coords = [
                        { lat: 4.7110, lng: -74.0721 },
                        { lat: 4.8120, lng: -74.0521 },
                        { lat: 4.6120, lng: -74.0921 }
                    ];
                    const c = coords[Math.floor(Math.random() * coords.length)];
                    o.geolocalizacion = {
                        lat: c.lat + (Math.random() - 0.5) * 0.01,
                        lng: c.lng + (Math.random() - 0.5) * 0.01
                    };
                }
            });
            return parsed;
        } catch (e) { /* fallback */ }
    }
    const fresh = generarDatosDesdeExcel();
    localStorage.setItem('gasnet_data_glass', JSON.stringify(fresh));
    return fresh;
}

function guardarDatos(data) {
    localStorage.setItem('gasnet_data_glass', JSON.stringify(data));
}

// ================================================================
//  UTILITIES (FUNCIONES GLOBALES)
// ================================================================

function getEstadoBadge(estadoCaferedes) {
    const info = ESTADOS_CAFEREDES[estadoCaferedes] || { label: estadoCaferedes || 'Desconocido', cls: 'registrado' };
    return `<span class="badge-estado ${info.cls}">${info.label}</span>`;
}

function getEstadoLabel(estadoCaferedes) {
    const info = ESTADOS_CAFEREDES[estadoCaferedes] || { label: estadoCaferedes || 'Desconocido' };
    return info.label;
}

function getEST(estadoCaferedes) {
    for (const [est, estados] of Object.entries(EST_A_CAFEREDES)) {
        if (estados.includes(estadoCaferedes)) {
            return parseInt(est);
        }
    }
    return 5;
}

function formatearFecha(fecha) {
    if (!fecha) return '—';
    return fecha;
}

function contarPorEstadoCaferedes(ordenes, estado) {
    return ordenes.filter(o => o.estado_caferedes === estado).length;
}

function contarPorEST(ordenes, est) {
    const estados = EST_A_CAFEREDES[est] || [];
    return ordenes.filter(o => estados.includes(o.estado_caferedes)).length;
}