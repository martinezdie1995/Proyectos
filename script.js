const { createElement } = require("react");

//=============================DEFINIMOS VARIABLES=========================
const buscadorTareas = document.getElementById("Buscador-Tareas");
const modoClaroBtn = document.getElementById("Modo-Claro");
const modoOscuroBtn = document.getElementById("Modo-Oscuro");
const contenedorTareas = document.getElementById("Contenedor-Tareas");
//=============================FUNCIONES===================================

function crearContenedorTarea (){
const tarjetaTarea = document.createElement("div");
const divIzq = document.createElement("div");
const lista =  document.createElement("ul");
const elementoLista = document.createElement("li");
const checkBox = document.createElement("input");
const textoTarea = document.createElement("div");
const tipoTarea = document.createElement("div");
const fecha = document.createElement("div");
const prioridad = document.createElement("div");
const favorito = document.createElement("div");
const editar = document.createElement("div");
const borrar = document.createElement("div");


tarjetaTarea.appendChild(lista);
////LADO IZQUIERDO////
lista.appendChild(elementoLista);
    elementoLista.appendChild(divIzq)
        divIzq.appendChild(checkBox);
        divIzq.appendChild(textoTarea);
        divIzq.appendChild(tipoTarea);
////LADO DERECHO////
    elementoLista.appendChild(divIzq);
    divIzq.appendChild(fecha);
    divIzq.appendChild(prioridad);
    divIzq.appendChild(favorito);
    divIzq.appendChild(editar);
    divIzq.appendChild(borrar);

return
}

function darEstilo (){
tarjetaTarea.classList.add("Tarea")

}