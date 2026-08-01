const { createElement } = require("react");

//=============================DEFINIMOS VARIABLES=========================
const buscadorTareas = document.getElementById("Buscador-Tareas");
const modoClaroBtn = document.getElementById("Modo-Claro");
const modoOscuroBtn = document.getElementById("Modo-Oscuro");
const contenedorTareas = document.getElementById("Contenedor-Tareas");
//=============================FUNCIONES===================================

function crearContenedorTarea (){
contenedorTareas.innerHTML += 
`<li>
    <div>
        <input type="checkbox"></input>
        <p id="Texto-Tarea"></p>
        <div id="Tipo-Tarea"></div>
    </div>
    <div>
        <div id="Fecha"></div>
        <div id="Prioridad"></div>
        <div id="Favorito"></div> 
        <button id="Editar-Btn"></button>
        <button id="Borrar-Btn"></button>
    </div>
</li>
`
return
}

function darEstilo (){
tarjetaTarea.classList.add("Tarea")

}