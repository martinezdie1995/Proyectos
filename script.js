
//=============================DEFINIMOS VARIABLES=========================


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
const marcarCompletadasBtn = document.getElementById("Marcar-Completadas-Btn");
lucide.createIcons();
//=============================FUNCIONES===================================


    function crearContenedorTarea() {

    const nuevaTarea = document.createElement("li");
    nuevaTarea.classList.add("Tarea-Item");


    nuevaTarea.innerHTML = `
        
            <div class="Tarea">
                <div class="TareaIzquierda">
                    <input type="checkbox" class="checkbox">
                    <p class="texto-tarea">${inputTarea.value}</p>
                    <div class="tipo-tarea">${tipoBtn.value}</div>
                </div>
                <div class="TareaDerecha">
                <button class="fecha-btn"><i data-lucide="calendar"></i></button>
                    <input class="fecha" type="date">
                    <div class="prioridad">${prioridadBtn.value}</div>
                    <div class="favorito"></div>
                    <button class="editar-btn"><i data-lucide="square-pen"></i></button>
                    <button class="borrar-btn">
                    <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `
    ;
listaTareas.appendChild(nuevaTarea);
lucide.createIcons();
return nuevaTarea;
}

function darEstilo() {
    const ultima = listaTareas.lastElementChild;
    const tipo = ultima.querySelector(".tipo-tarea");

    switch (tipoBtn.value) {
        case "Trabajo":
            tipo.classList.add("TipoTareaTrabajo");
            
            break;

        case "Salud":
            tipo.classList.add("TipoTareaSalud");
            
            break;

        case "Personal":
            tipo.classList.add("TipoTareaPersonal");
            
            break;

        case "Estudio":
            tipo.classList.add("TipoTareaEstudio");
            
            break;
    }
    
}

function darPrioridad() {
    const ultima = listaTareas.lastElementChild;
    const prioridad = ultima.querySelector(".prioridad");

if (prioridadBtn.value === "Prioridad") {
    prioridad.textContent = "";
    return;
}
    switch (prioridadBtn.value) {

        case "Urgente":
            prioridad.classList.add("PrioridadUrgente");
            break;

        case "Alta":
            prioridad.classList.add("PrioridadAlta");

            break;

        case "Media":
            prioridad.classList.add("PrioridadMedia");

            break;

        case "Baja":
            prioridad.classList.add("PrioridadBaja");

            break;
    }
}


let iconoPrioridad = "";

switch (prioridadBtn.value) {
    case "Urgente":
        iconoPrioridad = "arrow-big-up";
        break;

    case "Alta":
        iconoPrioridad = "arrow-up";
        break;

    case "Media":
        iconoPrioridad = "arrow-right";
        break;

    case "Baja":
        iconoPrioridad = "arrow-down";
        break;
}

//=============================LISTENERS===================================
agregarTareaBtn.addEventListener("click", () => {
    if (inputTarea.value.trim() === "") {
        alert("Por favor, ingrese una tarea.");
        return;
    }
    crearContenedorTarea();
    darEstilo();
    darPrioridad();
    inputTarea.value = "";
    prioridadBtn.value = "Prioridad";
    tipoBtn.value = "Tipo";

    contadorTareas.textContent = listaTareas.children.length;

});



listaTareas.addEventListener("click", (e) => {
    const borrarBtn = e.target.closest(".borrar-btn");

    if (!borrarBtn) return;

    const tarea = borrarBtn.closest(".Tarea-Item");
    const checkbox = tarea.querySelector('input[type="checkbox"]');

    if (checkbox.checked) {
        tarea.remove();
        contadorTareas.textContent = listaTareas.children.length;
    }
});

listaTareas.addEventListener("click", (e) => {
    console.log(e.target);
    const boton = e.target.closest(".fecha-btn");

    if (!boton) return;

    console.log("Botón encontrado");

    const tarea = boton.closest(".Tarea");
    const inputFecha = tarea.querySelector(".fecha");

    inputFecha.showPicker();
});

listaTareas.addEventListener("change", (e) => {

if (e.target.classList.contains("fecha")) {

    const tarea = e.target.closest(".Tarea");
    const textoFecha = tarea.querySelector(".fecha-texto");

    textoFecha.textContent = e.target.value;

    const [anio, mes, dia] = e.target.value.split("-");

textoFecha.textContent = `${dia}/${mes}/${anio}`;
}

    

    if (e.target.classList.contains("checkbox")) {
    const hayMarcadas = listaTareas.querySelectorAll(".checkbox:checked").length > 0;

    marcarCompletadasBtn.hidden = !hayMarcadas;
}

});

modoClaroBtn.addEventListener("click", () => {
    document.body.classList.remove("dark-mode");

});

modoOscuroBtn.addEventListener("click", () => {

    document.body.classList.add("dark-mode");
});

marcarCompletadasBtn.addEventListener("click", () => {

    const checkboxesMarcados = listaTareas.querySelectorAll(".checkbox:checked");

    checkboxesMarcados.forEach((checkbox) => {
        const tarea = checkbox.closest(".Tarea");
        tarea.classList.add("TareaCompletada");
        checkbox.checked = false;
    });

    marcarCompletadasBtn.hidden = true;
});

