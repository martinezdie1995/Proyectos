
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
const tareascompletadas = document.getElementById("tareascompletadas");
const circuloTrabajo = document.querySelector(".circulo-trabajo");
const circuloEstudio = document.querySelector(".circulo-estudio");
const circuloPersonal = document.querySelector(".circulo-personal");
const circuloSalud = document.querySelector(".circulo-salud");
const trabajo = document.querySelector(".trabajo");
const estudio = document.querySelector(".estudio");
const personal = document.querySelector(".personal");
const salud = document.querySelector(".salud");
const ordenamientoTareas = document.getElementById("Ordenamiento-Tareas")

let tareas = [];
let TareasGuardadas = JSON.parse(localStorage.setItem("tareas","tarea"));
tareas.push(TareasGuardadas);
tareas.forEach(tarea=>{

})
actualizarBotonMarcar();
lucide.createIcons();
//=============================FUNCIONES===================================

function GuardarTareaLocal(){
    let textoTarea = getElementById("texto-tarea");
    let tipoTarea = getElementById("tipo-tarea");
    let prioridadTarea = getElementById("prioridad");
    let favoritoTarea = getElementById("favorito-btn");

    nuevaTarea.forEach(item=>{
        let tareaGuardada = {
            checkbox = item.checkbox.checked,
            texto = item.textoTarea.textContent,
            fecha = item.tipoTarea.textContent,
            prioridad = item.prioridadTarea.textContent,
            favorito = item.favoritoBtn.classList.contains("activo")
    }
    })
    tareas.push(tareaGuardada);
    
}
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
                <div class="contenedor-fecha">

    <button class="fecha-btn">
        <i data-lucide="calendar"></i>
    </button>

    <input class="fecha" type="date">

    <span class="fecha-texto">
        Agrega una fecha límite
    </span>

</div>
                    <div class="prioridad">${prioridadBtn.value}</div>
                    <button class="favorito-btn">
    <i data-lucide="heart"></i>
</button>
                    <button class="editar-btn"><i data-lucide="square-pen"></i></button>
                    <button class="borrar-btn">
                    <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `
    ;
listaTareas.appendChild(nuevaTarea);
lucide.createIcons({
    attrs: {
        "stroke-width": 2
    }
});
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

    prioridad.dataset.valor = prioridadBtn.value;

    if (prioridadBtn.value === "Prioridad") {
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
    actualizarProgreso();
    if(tipoBtn.value === "Trabajo" ) {
trabajo.textContent = Number(   trabajo.textContent ||0) + 1 ;
    }
    if(tipoBtn.value === "Estudio" ) {
        estudio.textContent = Number(   estudio.textContent ||0) + 1 ;
    }
    if(tipoBtn.value === "Personal" ) {
        personal.textContent = Number(   personal.textContent ||0) + 1 ;
    }
    if(tipoBtn.value === "Salud" ) {
        salud.textContent = Number(   salud.textContent ||0) + 1 ;
    }
    inputTarea.value = "";
    prioridadBtn.value = "Prioridad";
    tipoBtn.value = "Tipo";

    contadorTareas.textContent = listaTareas.children.length;
    


    });

listaTareas.addEventListener("click", (e) => {
    const borrarBtn = e.target.closest(".borrar-btn");

    if (!borrarBtn) return;

    const tarea = borrarBtn.closest(".Tarea-Item");

if (confirm("¿Seguro que quieres eliminar esta tarea?")) {
    tarea.remove();
    contadorTareas.textContent = listaTareas.children.length;
    tareascompletadas.textContent = listaTareas.querySelectorAll(".TareaCompletada").length;
        const tipo = tarea.querySelector(".tipo-tarea").textContent;
        switch (tipo) {
            case "Trabajo":
                trabajo.textContent --;
                break;
            case "Estudio":
                estudio.textContent --;
                break;
            case "Personal":
                personal.textContent --;
                break;
            case "Salud":
                salud.textContent --;
                break;
        }
}

    actualizarProgreso();
    actualizarBotonMarcar();
});

listaTareas.addEventListener("click", (e) => {
    const favoritoBtn = e.target.closest(".favorito-btn");

    if (favoritoBtn){
        favoritoBtn.classList.toggle("activo");

    } 

    
    const boton = e.target.closest(".fecha-btn");

    if (boton){
        const tarea = boton.closest(".Tarea");
    const inputFecha = tarea.querySelector(".fecha");

    inputFecha.showPicker();
    } 

});

listaTareas.addEventListener("change", (e) => {

if (e.target.classList.contains("fecha")) {

    const tarea = e.target.closest(".Tarea");
    const textoFecha = tarea.querySelector(".fecha-texto");

    if (e.target.value === "") {
        textoFecha.textContent = "Agrega una fecha límite";
        return;
    }

    const [anio, mes, dia] = e.target.value.split("-");

    textoFecha.textContent = `${dia}/${mes}/${anio}`;
}
    

    if (e.target.classList.contains("checkbox")) {
    actualizarBotonMarcar();
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
        checkbox.checked = true;
        tareascompletadas.textContent = listaTareas.querySelectorAll(".TareaCompletada").length;
    });

    marcarCompletadasBtn.hidden = true;
    actualizarProgreso();

actualizarBotonMarcar();
});


function actualizarProgreso() {
    const total = listaTareas.children.length;
    const completadas = listaTareas.querySelectorAll(".TareaCompletada").length;

    const porcentaje = total === 0
        ? 0
        : Math.round((completadas / total) * 100);

    document.getElementById("Barra-Completada").style.width = `${porcentaje}%`;

    document.getElementById("Contador-Tareas-Completadas").textContent =
        `${completadas} de ${total} tareas completadas`;

    document.getElementById("Porcentaje-Progreso").textContent =
        `${porcentaje}%`;
}


const botonesFiltro = document.querySelectorAll(
    "#Filtro-Todas, #Filtro-Pendientes, #Filtro-Completadas"
);

botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", (e) => {

        botonesFiltro.forEach((btn) => btn.classList.remove("activo"));
        e.currentTarget.classList.add("activo");

        const filtro = e.currentTarget.id;

        const tareas = listaTareas.querySelectorAll(".Tarea-Item");

        tareas.forEach((tarea) => {

            const tareaVisual = tarea.querySelector(".Tarea");
            const completada = tareaVisual.classList.contains("TareaCompletada");

            switch (filtro) {
                case "Filtro-Todas":
                    tarea.style.display = "";
                    break;

                case "Filtro-Pendientes":
                    tarea.style.display = completada ? "none" : "";
                    break;

                case "Filtro-Completadas":
                    tarea.style.display = completada ? "" : "none";
                    break;
            }
        });
    });
});

function actualizarBotonMarcar() {
    const hayMarcadas =
        listaTareas.querySelectorAll(".checkbox:checked").length > 0;



    marcarCompletadasBtn.hidden = !hayMarcadas;
}


function filtroOrdenamiento() {

    if (ordenamientoTareas.value === "Prioridad") {

        const tareas = Array.from(
            listaTareas.querySelectorAll(".Tarea-Item")
        );

        const ordenPrioridad = {
            "Urgente": 1,
            "Alta": 2,
            "Media": 3,
            "Baja": 4,
            "": 5
        };

        tareas.sort((a, b) => {

            const prioridadA = a.querySelector(".prioridad").dataset.valor;
            const prioridadB = b.querySelector(".prioridad").dataset.valor;

            return ordenPrioridad[prioridadA] - ordenPrioridad[prioridadB];

        });

        tareas.forEach(tarea => {
            listaTareas.appendChild(tarea);
        });
    }


    if (ordenamientoTareas.value === "Favoritos") {

        const tareas = Array.from(
            listaTareas.querySelectorAll(".Tarea-Item")
        );

        tareas.sort((a, b) => {

            const favoritoA = a.querySelector(".favorito-btn")
                .classList.contains("activo");

            const favoritoB = b.querySelector(".favorito-btn")
                .classList.contains("activo");

            return favoritoB - favoritoA;

        });

        tareas.forEach(tarea => {
            listaTareas.appendChild(tarea);
        });
    }
}

ordenamientoTareas.addEventListener("change", filtroOrdenamiento);