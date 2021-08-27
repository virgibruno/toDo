
// Se incializan variables globales
const clave = localStorage.getItem("clave") !== null ? JSON.parse(localStorage.getItem("clave")) : JSON.parse(sessionStorage.getItem("clave"));

const baseURL = "https://ctd-todo-api.herokuapp.com/v1"
const headers = {
    authorization : clave !== null ? clave.jwt : "",
    "Content-type" : "application/json"
} 

window.addEventListener("load", e => {
    /* -------------------------------------------
        Si no hay clave, reenviar al usuario a la página de login
    ------------------------------------------- */
    
    if (clave === null) {
        e.preventDefault();
        location.href="./login.html";
    }

    /* -------------------------------------------
        Capturar elementos a manipular
    ------------------------------------------- */

    const tareasPendientes = document.querySelector(".tareas-pendientes");
    const tareasTerminadas = document.querySelector(".tareas-terminadas");
    const enviarNvaTarea = document.querySelector("form.nueva-tarea");
    const nuevaTarea = document.querySelector("#textNuevaTarea");
    const cerrarSesion = document.querySelector("#cerrar-sesion");


    /* -------------------------------------------
        Pedir tareas existentes a la api: si tira error vuelve a la página de inicio, si no tiene tareas aparece carterlito de bienvenida y sino se renderizan las tareas.
    ------------------------------------------- */    

    fetch(`${baseURL}/tasks`, {
        method : "GET",
        headers : headers
    })
        .then(response => response.json())
        .then(listaTareas => {
            if(typeof listaTareas === "string") {
                alert("Error en sistema. Vuelva a ingresar");
                location.href="./login.html";
            }
            if (listaTareas.length === 0){
                tareasPendientes.innerHTML = `<h2>Acá aparecerán tus tareas pendientes</h2>`;
            } else {
                renderizarTareas(listaTareas);
                let contenidoTextoTareas = document.querySelectorAll(".nombre")

                //primera aproximacion a modificar comentarios!
                for (tarea of contenidoTextoTareas) {
                    tarea.addEventListener("click", e =>{
                        let elemento = e.srcElement
                        elemento.innerHTML = `
                            <form class="modificar-tarea">
                                <input type="text" value="${elemento.innerText}" class="textTareaModificada" autofocus="autofocus">
                            </form>
                        `
                        console.log(elemento)
                    })
                }
                
            }
        })
        
    /* -------------------------------------------
        Crear nueva tarea: siempre que la tarea no esté vacía, se envía la nueva tarea a la api, se espera la respuesta y se renderiza la nueva tarea
    ------------------------------------------- */
    
    enviarNvaTarea.addEventListener("submit", (e) => {
        e.preventDefault();
        if (nuevaTarea.value !="") {
            
            let data = {
                description: nuevaTarea.value,
            }
            
            fetch(`${baseURL}/tasks`, {
                method : "POST",
                headers : headers,
                body : JSON.stringify(data)
            })
            .then(response => response.json())
            .then(tareaCreada => {
                renderizarNuevaTarea(tareaCreada);
                enviarNvaTarea.reset();
            })
        };
    })

    /* -------------------------------------------
        Cerrar sesión
    ------------------------------------------- */
    
    cerrarSesion.addEventListener("click", e =>{
        if(confirm('¿Quiere cerrar sesión?')){
            localStorage.clear();
            sessionStorage.clear();
            location.href="./login.html";
        }
    })
    
            
            
    /* -------------------------------------------
        Funciones
    ------------------------------------------- */

    // Establece el formato que tendrán las tareas.
    function formatoTarea (tarea) {
        let dia = tarea.createdAt.slice(8,10);
        let mes = tarea.createdAt.slice(5,7);
        let anio = tarea.createdAt.slice(2,4);

        return `
            <li class="tarea" data-id=${tarea.id} data-completed=${tarea.completed}>
                <div class="cambiarEstado"></div>
                <div class="descripcion">
                    <p class="nombre">${tarea.description}</p>
                    <p class="timestamp">
                        Creada: ${dia}/${mes}/${anio}
                        <i class="far fa-trash-alt eliminar"></i>
                    </p>
                    
                </div>
            </li> 
        `
    }
    
    // Muestra un array de tareas pasado por parámetro. Habilita los botones para cambiar de estado (marcar como terminadas o pendientes) y eliminar tareas.
    function renderizarTareas(listaTareas) {
        tareasPendientes.innerHTML = "";
        tareasTerminadas.innerHTML = "";
            
        for (tarea of listaTareas) {
            if (!tarea.completed) {
                tareasPendientes.insertAdjacentHTML("afterbegin",formatoTarea(tarea));
            } else {
                tareasTerminadas.insertAdjacentHTML("afterbegin",formatoTarea(tarea));
            }
        }
        habilitarBotonesEstado();
        habilitarBotonesEliminacion();
    }

    // Muestra una tarea pasada por parámetro. Habilita los botones para cambiar de estado (marcar como terminadas o pendientes) y eliminar tareas.
    function renderizarNuevaTarea(tarea) {
        if (!tarea.completed) {
            tareasPendientes.insertAdjacentHTML("afterbegin",formatoTarea(tarea));
        } else {
            tareasTerminadas.insertAdjacentHTML("afterbegin",formatoTarea(tarea));
        }
        habilitarBotonesEstado();
        habilitarBotonesEliminacion();
    }

    // Habilita botones para cambiar de pendientes a terminadas y viceversa: captura todos los botones y los pone en escucha, al apretarlos se obtiene la tarea seleccionada (el elemento completo y la descripcion como string). Luego se la elimina del lugar donde está y se la renderiza nuevamente. Por último se envía la información a la api.
    function habilitarBotonesEstado() {
        let botones = document.querySelectorAll(".cambiarEstado");
        for (btn of botones) {
            btn.addEventListener("click", (e) => {
                let elemento = e.srcElement.parentNode;
                let descripcionTarea = e.srcElement.nextElementSibling.children[0].innerHTML;
                let padre = elemento.parentNode;
                
                padre.removeChild(elemento);
                
                let data = {
                    description : descripcionTarea,
                    completed : elemento.dataset.completed == "true" ? false : true,
                };

                fetch(`${baseURL}/tasks/${elemento.dataset.id}`, {
                    method : "PUT",
                    headers : headers,
                    body : JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(tareaModificada => renderizarNuevaTarea(tareaModificada))
            })
        }
    }

    // Habilita botones para eliminar tareas: captura todos los botones y los pone en escucha, al apretarlos se obtiene la tarea seleccionada y se la elimina del lugar donde está. Por último se envía la información a la api.
    function habilitarBotonesEliminacion() {
        let botones = document.querySelectorAll(".eliminar");
        for (btn of botones) {
            btn.addEventListener("click", (e) => {
                let elemento = e.srcElement.parentNode.parentNode.parentNode;
                let id = elemento.dataset.id;
                let padre = elemento.parentNode;
                
                padre.removeChild(elemento);

                fetch(`${baseURL}/tasks/${id}`, {
                    method : "DELETE",
                    headers : headers,
                })
            })
        }
    }
})
