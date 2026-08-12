//============================= SELECCIÓN DE ELEMENTOS =========================
const buscadorTareas = document.getElementById("Buscador-Tareas");
const modoClaroBtn = document.getElementById("Modo-Claro");
const modoOscuroBtn = document.getElementById("Modo-Oscuro");
const contenedorTareas = document.getElementById("Contenedor-Tareas");
const tipoBtn = document.getElementById("Tipo-Btn");
const agregarTareaBtn = document.getElementById("Agregar-Tarea-Btn");
const inputTarea = document.getElementById("Input-Tarea");
const listaTareas = document.getElementById("Lista-Tareas");
const prioridadBtn = document.getElementById("Prioridad-Btn");
const contadorTareas = document.getElementById("tareastodas");
const tareascompletadas = document.getElementById("tareascompletadas");
const tareaspendientes = document.getElementById("tareaspendientes");
const borrarCompletadasBtn = document.getElementById("borrarCompletadas");

// Contadores por categoría
const trabajo = document.querySelector(".trabajo");
const estudio = document.querySelector(".estudio");
const personal = document.querySelector(".personal");
const salud = document.querySelector(".salud");

// Formulario y Filtros
const ordenamientoTareas = document.getElementById("Ordenamiento-Tareas");
const fechaFormularioBtn = document.getElementById("Fecha-Formulario-Btn");
const fechaFormulario = document.getElementById("Fecha-Formulario");
const fechaFormularioTexto = document.getElementById("Fecha-Formulario-Texto");
const cancelarEdicionBtn = document.getElementById("Cancelar-Edicion-Btn");

//============================= ESTADO DE LA APLICACIÓN =========================
let tareaEditando = null;
let filtroActual = "Filtro-Todas";
const STORAGE_KEY = "centroDeTareas";

//============================= FUNCIONES AUXILIARES =========================

function renderizarIconos() {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }
}

function crearElementoTarea(datos) {
    const tareaItem = document.createElement("li");
    tareaItem.classList.add("Tarea-Item");

    const tipoClaseMap = {
        "Trabajo": "TipoTareaTrabajo",
        "Salud": "TipoTareaSalud",
        "Personal": "TipoTareaPersonal",
        "Estudio": "TipoTareaEstudio"
    };

    const prioridadClaseMap = {
        "Urgente": "PrioridadUrgente",
        "Alta": "PrioridadAlta",
        "Media": "PrioridadMedia",
        "Baja": "PrioridadBaja"
    };

    const tipoClase = tipoClaseMap[datos.tipo] || "";
    const prioridadClase = prioridadClaseMap[datos.prioridad] || "";
    const esCompletada = datos.completada ? "TareaCompletada" : "";
    const esFavorito = datos.favorito ? "activo" : "";
    const isChecked = datos.completada ? "checked" : "";

    let fechaFormateada = "Agrega una fecha límite";
    if (datos.fecha) {
        const partes = datos.fecha.split("-");
        if (partes.length === 3) {
            fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
    }

    tareaItem.innerHTML = `
        <div class="Tarea ${esCompletada}">
            <div class="TareaIzquierda">
                <input type="checkbox" class="checkbox" ${isChecked}>
                <p class="texto-tarea">${datos.texto}</p>
                <div class="tipo-tarea ${tipoClase}">${datos.tipo}</div>
            </div>
            <div class="TareaDerecha">
                <div class="contenedor-fecha">
                    <button class="fecha-btn" type="button" aria-label="Seleccionar fecha">
                        <i data-lucide="calendar"></i>
                    </button>
                    <input class="fecha" type="date" value="${datos.fecha || ""}">
                    <span class="fecha-texto">${fechaFormateada}</span>
                </div>
                <div class="prioridad ${prioridadClase}" data-valor="${datos.prioridad}">${datos.prioridad}</div>
                <button class="favorito-btn ${esFavorito}" type="button" aria-label="Agregar a favoritos">
                    <i data-lucide="heart"></i>
                </button>
                <button class="editar-btn" type="button" aria-label="Editar tarea">
                    <i data-lucide="square-pen" aria-hidden="true"></i>
                </button>
                <button class="borrar-btn" type="button" aria-label="Eliminar tarea">
                    <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    `;

    return tareaItem;
}

//============================= GESTIÓN DE ALMACENAMIENTO =========================

function guardarTareas() {
    const tareas = Array.from(listaTareas.querySelectorAll(".Tarea-Item")).map((elemento) => {
        const tarea = elemento.querySelector(".Tarea");
        const inputFecha = elemento.querySelector(".fecha");
        const prioridadEl = elemento.querySelector(".prioridad");

        return {
            texto: elemento.querySelector(".texto-tarea").textContent,
            tipo: elemento.querySelector(".tipo-tarea").textContent,
            prioridad: prioridadEl.dataset.valor || prioridadEl.textContent,
            fecha: inputFecha ? inputFecha.value : "",
            completada: tarea ? tarea.classList.contains("TareaCompletada") : false,
            favorito: elemento.querySelector(".favorito-btn").classList.contains("activo")
        };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

function cargarTareas() {
    listaTareas.innerHTML = "";
    const tareasGuardadas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    tareasGuardadas.forEach((datos) => {
        const tareaItem = crearElementoTarea(datos);
        listaTareas.appendChild(tareaItem);
    });

    actualizarContadores();
    renderizarIconos();
}

//============================= ACTUALIZACIÓN DE ESTADOS Y UI =========================

function actualizarProgreso() {
    const total = listaTareas.querySelectorAll(".Tarea-Item").length;
    const completadas = listaTareas.querySelectorAll(".TareaCompletada").length;
    const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

    const barraCompletada = document.getElementById("Barra-Completada");
    if (barraCompletada) barraCompletada.style.width = `${porcentaje}%`;

    const contadorTxt = document.getElementById("Contador-Tareas-Completadas");
    if (contadorTxt) contadorTxt.textContent = `${completadas} de ${total} tareas completadas`;

    const porcentajeTxt = document.getElementById("Porcentaje-Progreso");
    if (porcentajeTxt) porcentajeTxt.textContent = `${porcentaje}%`;
}



function actualizarContadores() {
    const tareas = listaTareas.querySelectorAll(".Tarea-Item");
    const completadas = listaTareas.querySelectorAll(".TareaCompletada");

    const total = tareas.length;
    const totalCompletadas = completadas.length;
    const totalPendientes = total - totalCompletadas;

    if (contadorTareas) contadorTareas.textContent = total;
    if (tareascompletadas) tareascompletadas.textContent = totalCompletadas;
    if (tareaspendientes) tareaspendientes.textContent = totalPendientes;

    let countTrabajo = 0;
    let countEstudio = 0;
    let countPersonal = 0;
    let countSalud = 0;

    tareas.forEach((tarea) => {
        const tipoEl = tarea.querySelector(".tipo-tarea");
        if (!tipoEl) return;
        const tipoText = tipoEl.textContent.trim();

        switch (tipoText) {
            case "Trabajo": countTrabajo++; break;
            case "Estudio": countEstudio++; break;
            case "Personal": countPersonal++; break;
            case "Salud": countSalud++; break;
        }
    });

    if (trabajo) trabajo.textContent = countTrabajo;
    if (estudio) estudio.textContent = countEstudio;
    if (personal) personal.textContent = countPersonal;
    if (salud) salud.textContent = countSalud;

    actualizarProgreso();
}

function actualizarListaTareas() {
    const textoBusqueda = buscadorTareas ? buscadorTareas.value.toLowerCase().trim() : "";
    const tareas = listaTareas.querySelectorAll(".Tarea-Item");

    tareas.forEach((tareaItem) => {
        const tareaVisual = tareaItem.querySelector(".Tarea");
        const textoTareaEl = tareaItem.querySelector(".texto-tarea");

        const textoTarea = textoTareaEl ? textoTareaEl.textContent.toLowerCase() : "";
        const completada = tareaVisual ? tareaVisual.classList.contains("TareaCompletada") : false;

        const coincideBusqueda = textoTarea.includes(textoBusqueda);

        let coincideFiltro = true;
        switch (filtroActual) {
            case "Filtro-Todas":
                coincideFiltro = true;
                break;
            case "Filtro-Pendientes":
                coincideFiltro = !completada;
                break;
            case "Filtro-Completadas":
                coincideFiltro = completada;
                break;
        }

        tareaItem.style.display = (coincideBusqueda && coincideFiltro) ? "" : "none";
    });
}

//============================= EDICIÓN DE TAREAS =========================

function editarTarea(tareaItem) {
    tareaEditando = tareaItem;

    const texto = tareaItem.querySelector(".texto-tarea").textContent;
    const tipo = tareaItem.querySelector(".tipo-tarea").textContent;
    const prioridadEl = tareaItem.querySelector(".prioridad");
    const prioridad = prioridadEl.dataset.valor || prioridadEl.textContent;
    const inputFecha = tareaItem.querySelector(".fecha");
    const fecha = inputFecha ? inputFecha.value : "";

    inputTarea.value = texto;
    tipoBtn.value = tipo;
    prioridadBtn.value = prioridad;
    fechaFormulario.value = fecha;

    if (fecha) {
        const partes = fecha.split("-");
        if (partes.length === 3) {
            fechaFormularioTexto.textContent = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
    } else {
        fechaFormularioTexto.textContent = "Sin fecha límite";
    }

    agregarTareaBtn.innerHTML = `
        <i data-lucide="save" aria-hidden="true"></i>
        Guardar cambios
    `;

    if (cancelarEdicionBtn) cancelarEdicionBtn.hidden = false;
    renderizarIconos();
    inputTarea.focus();
}

function cancelarEdicion() {
    tareaEditando = null;

    inputTarea.value = "";
    tipoBtn.value = "";
    prioridadBtn.value = "";
    fechaFormulario.value = "";
    fechaFormularioTexto.textContent = "Sin fecha límite";

    agregarTareaBtn.innerHTML = `
        <i data-lucide="plus" aria-hidden="true"></i>
        Agregar
    `;

    if (cancelarEdicionBtn) cancelarEdicionBtn.hidden = true;
    renderizarIconos();
}

function filtroOrdenamiento() {
    const tareas = Array.from(listaTareas.querySelectorAll(".Tarea-Item"));

    if (ordenamientoTareas.value === "Prioridad") {
        const ordenPrioridad = {
            "Urgente": 1,
            "Alta": 2,
            "Media": 3,
            "Baja": 4
        };

        tareas.sort((a, b) => {
            const prioAEl = a.querySelector(".prioridad");
            const prioBEl = b.querySelector(".prioridad");

            const prioA = prioAEl ? (prioAEl.dataset.valor || prioAEl.textContent) : "";
            const prioB = prioBEl ? (prioBEl.dataset.valor || prioBEl.textContent) : "";

            const valA = ordenPrioridad[prioA] || 5;
            const valB = ordenPrioridad[prioB] || 5;

            return valA - valB;
        });

        tareas.forEach((tarea) => listaTareas.appendChild(tarea));
    }

    if (ordenamientoTareas.value === "Favoritos") {
        tareas.sort((a, b) => {
            const favBtnA = a.querySelector(".favorito-btn");
            const favBtnB = b.querySelector(".favorito-btn");

            const favA = favBtnA ? favBtnA.classList.contains("activo") : false;
            const favB = favBtnB ? favBtnB.classList.contains("activo") : false;

            return favB - favA;
        });

        tareas.forEach((tarea) => listaTareas.appendChild(tarea));
    }
}

//============================= LISTENERS DE EVENTOS =========================

agregarTareaBtn.addEventListener("click", () => {
    if (inputTarea.value.trim() === "") {
        alert("Por favor, ingrese una tarea.");
        return;
    }

    if (tipoBtn.value === "") {
        alert("Seleccione un tipo de tarea.");
        return;
    }

    if (prioridadBtn.value === "") {
        alert("Seleccione una prioridad.");
        return;
    }

    if (tareaEditando) {
        // Modo Edición
        const texto = tareaEditando.querySelector(".texto-tarea");
        const tipo = tareaEditando.querySelector(".tipo-tarea");
        const prioridad = tareaEditando.querySelector(".prioridad");
        const fecha = tareaEditando.querySelector(".fecha");
        const fechaTexto = tareaEditando.querySelector(".fecha-texto");

        texto.textContent = inputTarea.value.trim();
        tipo.textContent = tipoBtn.value;
        tipo.className = "tipo-tarea";

        const tipoClaseMap = {
            "Trabajo": "TipoTareaTrabajo",
            "Salud": "TipoTareaSalud",
            "Personal": "TipoTareaPersonal",
            "Estudio": "TipoTareaEstudio"
        };
        if (tipoClaseMap[tipoBtn.value]) tipo.classList.add(tipoClaseMap[tipoBtn.value]);

        prioridad.textContent = prioridadBtn.value;
        prioridad.dataset.valor = prioridadBtn.value;
        prioridad.className = "prioridad";

        const prioridadClaseMap = {
            "Urgente": "PrioridadUrgente",
            "Alta": "PrioridadAlta",
            "Media": "PrioridadMedia",
            "Baja": "PrioridadBaja"
        };
        if (prioridadClaseMap[prioridadBtn.value]) prioridad.classList.add(prioridadClaseMap[prioridadBtn.value]);

        fecha.value = fechaFormulario.value;
        if (fechaFormulario.value === "") {
            fechaTexto.textContent = "Agrega una fecha límite";
        } else {
            const partes = fechaFormulario.value.split("-");
            if (partes.length === 3) {
                fechaTexto.textContent = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }
        }

        cancelarEdicion();
    } else {
        // Modo Creación
        const nuevaTarea = crearElementoTarea({
            texto: inputTarea.value.trim(),
            tipo: tipoBtn.value,
            prioridad: prioridadBtn.value,
            fecha: fechaFormulario.value,
            completada: false,
            favorito: false
        });

        listaTareas.appendChild(nuevaTarea);

        inputTarea.value = "";
        tipoBtn.value = "";
        prioridadBtn.value = "";
        fechaFormulario.value = "";
        fechaFormularioTexto.textContent = "Sin fecha límite";
    }

    actualizarContadores();
    guardarTareas();
    actualizarListaTareas();
    renderizarIconos();
});

listaTareas.addEventListener("click", (e) => {
    // Borrar
    const borrarBtn = e.target.closest(".borrar-btn");
    if (borrarBtn) {
        const tareaItem = borrarBtn.closest(".Tarea-Item");
        if (confirm("¿Seguro que quieres eliminar esta tarea?")) {
            if (tareaItem === tareaEditando) cancelarEdicion();
            tareaItem.remove();
            actualizarContadores();
            guardarTareas();
            actualizarListaTareas();
        }
        return;
    }

    // Editar
    const editarBtn = e.target.closest(".editar-btn");
    if (editarBtn) {
        const tareaItem = editarBtn.closest(".Tarea-Item");
        editarTarea(tareaItem);
        return;
    }

    // Favorito
    const favoritoBtn = e.target.closest(".favorito-btn");
    if (favoritoBtn) {
        favoritoBtn.classList.toggle("activo");
        guardarTareas();
        return;
    }

 // Picker Fecha Tarea
const fechaBtn = e.target.closest(".fecha-btn");

if (fechaBtn) {

    const tarea = fechaBtn.closest(".Tarea");
    const inputFecha = tarea.querySelector(".fecha");

    if (!inputFecha) return;

    try {
        if (typeof inputFecha.showPicker === "function") {
            inputFecha.showPicker();
        } else {
            inputFecha.click();
        }
    } catch (error) {
        inputFecha.click();
    }

    return;
}})

if (borrarCompletadasBtn) {
    borrarCompletadasBtn.addEventListener("click", () => {

        const tareasCompletadas = listaTareas.querySelectorAll(
            ".Tarea-Item .Tarea.TareaCompletada"
        );

        if (tareasCompletadas.length === 0) {
            alert("No hay tareas completadas para borrar.");
            return;
        }

        if (!confirm("¿Seguro que quieres borrar todas las tareas completadas?")) {
            return;
        }

        tareasCompletadas.forEach((tarea) => {
            tarea.closest(".Tarea-Item").remove();
        });

        actualizarContadores();
        guardarTareas();
        actualizarListaTareas();
    });
}
listaTareas.addEventListener("change", (e) => {
    // Cambiar fecha
    if (e.target.classList.contains("fecha")) {
        const tarea = e.target.closest(".Tarea");
        const textoFecha = tarea.querySelector(".fecha-texto");

        if (e.target.value === "") {
            textoFecha.textContent = "Agrega una fecha límite";
        } else {
            const partes = e.target.value.split("-");
            if (partes.length === 3) {
                textoFecha.textContent = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }
        }
        guardarTareas();
        return;
    }

    // Checkbox completado
    if (e.target.classList.contains("checkbox")) {
        const tarea = e.target.closest(".Tarea");
        if (e.target.checked) {
            tarea.classList.add("TareaCompletada");
        } else {
            tarea.classList.remove("TareaCompletada");
        }

        actualizarContadores();
        guardarTareas();
        actualizarListaTareas();
    }
});

// Modos Claro / Oscuro
if (modoClaroBtn) {
    modoClaroBtn.addEventListener("click", () => {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("modo", "claro");
    });
}

if (modoOscuroBtn) {
    modoOscuroBtn.addEventListener("click", () => {
        document.body.classList.add("dark-mode");
        localStorage.setItem("modo", "oscuro");
    });
}

if (cancelarEdicionBtn) {
    cancelarEdicionBtn.addEventListener("click", cancelarEdicion);
}


// Filtros y Buscador
const botonesFiltro = document.querySelectorAll("#Filtro-Todas, #Filtro-Pendientes, #Filtro-Completadas");
botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", (e) => {
        botonesFiltro.forEach((btn) => btn.classList.remove("activo"));
        e.currentTarget.classList.add("activo");
        filtroActual = e.currentTarget.id;
        actualizarListaTareas();
    });
});

if (buscadorTareas) {
    buscadorTareas.addEventListener("input", actualizarListaTareas);
}

if (ordenamientoTareas) {
    ordenamientoTareas.addEventListener("change", filtroOrdenamiento);
}

if (fechaFormularioBtn) {
    fechaFormularioBtn.addEventListener("click", () => {
        if (typeof fechaFormulario.showPicker === "function") {
            fechaFormulario.showPicker();
        } else {
            fechaFormulario.focus();
        }
    });
}

if (fechaFormulario) {
    fechaFormulario.addEventListener("change", () => {
        if (fechaFormulario.value === "") {
            fechaFormularioTexto.textContent = "Sin fecha límite";
            return;
        }
        const partes = fechaFormulario.value.split("-");
        if (partes.length === 3) {
            fechaFormularioTexto.textContent = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
    });
}

//============================= INICIALIZACIÓN =========================

const modoGuardado = localStorage.getItem("modo");
if (modoGuardado === "oscuro") {
    document.body.classList.add("dark-mode");
}

cargarTareas();
actualizarListaTareas();
