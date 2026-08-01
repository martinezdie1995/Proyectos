
//=============================DEFINIMOS VARIABLES=========================


const buscadorTareas = document.getElementById("Buscador-Tareas");
const modoClaroBtn = document.getElementById("Modo-Claro");
const modoOscuroBtn = document.getElementById("Modo-Oscuro");
const contenedorTareas = document.getElementById("Contenedor-Tareas");
const tipoBtn = document.getElementById("Tipo-Btn");
const agregarTareaBtn = document.getElementById("Agregar-Tarea-Btn");
const inputTarea = document.getElementById("Input-Tarea");

//=============================FUNCIONES===================================


function crearContenedorTarea (){
contenedorTareas.innerHTML += 
`
<li>
    <div id="Tarea">
    <div class="TareaIzquierda">
        <input type="checkbox"></input>
        <p class="texto-tarea">${inputTarea.value}</p>
        <div class="tipo-tarea">${tipoBtn.value}</div>
    </div>

    <div class="TareaDerecha">
        <div class="fecha"></div>
        <div class="prioridad"></div>
        <div class="favorito"></div> 
        <button class="editar-btn"></button>
        <button class="borrar-btn"><i data-lucide="trash-2"></i> </button>
    </div>
    </div>
</li>
`
lucide.createIcons();
return contenedorTareas;
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