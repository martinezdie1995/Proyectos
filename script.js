
//=============================DEFINIMOS VARIABLES=========================


const buscadorTareas = document.getElementById("Buscador-Tareas");
const modoClaroBtn = document.getElementById("Modo-Claro");
const modoOscuroBtn = document.getElementById("Modo-Oscuro");
const contenedorTareas = document.getElementById("Contenedor-Tareas");
const tipoBtn = document.getElementById("Tipo-Btn");
const agregarTareaBtn = document.getElementById("Agregar-Tarea-Btn");
const inputTarea = document.getElementById("Input-Tarea");
const listaTareas = document.getElementById("Lista-Tareas");

//=============================FUNCIONES===================================


function crearContenedorTarea() {
listaTareas.insertAdjacentHTML(
    "beforeend",
    `
    <li class="Tarea-Item">
        <div class="Tarea">
            <div class="TareaIzquierda">
                <input type="checkbox">
                <p class="texto-tarea">${inputTarea.value}</p>
                <div class="tipo-tarea">${tipoBtn.value}</div>
            </div>

            <div class="TareaDerecha">
            <button class="fecha-btn"><i data-lucide="calendar"></i></button>
                <input class="fecha" type="date">
                <div class="prioridad"></div>
                <div class="favorito"></div>
                <button class="editar-btn"><i data-lucide="square-pen"></i></button>
                <button class="borrar-btn">
                <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    </li>
    `
);

lucide.createIcons();
return listaTareas;
}

function darEstilo() {
    const ultima = contenedorTareas.lastElementChild;
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


//=============================LISTENERS===================================
agregarTareaBtn.addEventListener("click", () => {
    crearContenedorTarea();
    darEstilo();
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
    if (!e.target.classList.contains("fecha")) return;

    console.log(e.target.value);
});

modoClaroBtn.addEventListener("click", () => {
    document.body.classList.remove("dark-mode");

});

modoOscuroBtn.addEventListener("click", () => {

    document.body.classList.add("dark-mode");
});


