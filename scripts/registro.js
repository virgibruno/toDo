const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const numeros = "1234567890";
const letrasMinuscula = "abcdefghijklmnñopqrstuvwxyz";
const letrasMayuscula = letrasMinuscula.toUpperCase();

function tieneNumeros(string){
    for(caracter of string) {
        if(numeros.search(caracter) != -1) {
            return true;
        }
    }
    return false;
}

function tieneLetraMinuscula(string) {
    for(caracter of string) {
        if(letrasMinuscula.search(caracter) != -1) {
            return true;
        }
    }
    return false;
}

function tieneLetraMayuscula(string) {
    for(caracter of string) {
        if(letrasMayuscula.search(caracter) != -1) {
            return true;
        }
    }
    return false;
}

function tieneCaracterEspecial(string) {
    for (caracter of string) {
        if(letrasMayuscula.search(caracter) == -1 && letrasMinuscula.search(caracter) == -1 && numeros.search(caracter) == -1) {
            return true;
        }
    }
    return false;
}


window.addEventListener("load", e=>{
    // redirigir a página de tareas si ya está la sesión iniciada
    if (sessionStorage.getItem("clave") !== null || localStorage.getItem("clave") !== null) {
        e.preventDefault();
        location.href = "./index.html"
    }

    // capturar formulario
    const formularioRegistro = document.querySelector("#registro");
    const nombre = document.querySelector("#nombre");
    const apellido = document.querySelector("#apellido");
    const password = document.querySelector("#passwordRegistro");
    const password2 = document.querySelector("#password-2");
    const email = document.querySelector("#emailRegistro");
    const todosLosCampos = document.querySelectorAll("input");
    const errorRegistro = document.querySelector("#errorRegistro");
    const mantenerIniciada = document.querySelector("input.checkbox");
    
    // capturar espacio para errores
    const errorNombre = document.querySelector("#error-nombre");
    const errorApellido = document.querySelector("#error-apellido");
    const errorPassword = document.querySelector("#error-pass");
    const errorPassword2 = document.querySelector("#error-pass2");
    const errorEmail = document.querySelector("#error-email");
    
    formularioRegistro.addEventListener("submit", e=>{
        e.preventDefault();
        /* ---------------------------------
            Validación del formulario
        --------------------------------- */
        
        // formatear errores
        let errores = [];
        errorNombre.innerHTML ="";
        errorApellido.innerHTML ="";
        errorPassword.innerHTML="";
        errorPassword2.innerHTML="";
        errorEmail.innerHTML="";
        for(campo of todosLosCampos) {
            campo.classList.remove("error")
        }

        // errores nombre: por lo menos 3 letras, máximo 50 letras, sin números
        if(nombre.value.trim().length < 3) {
            errores.push("nombreCorto");
            errorNombre.innerHTML = "Debe tener al menos 3 letras<br>";
            nombre.classList.add("error");
        }
        if(nombre.value.trim().length > 50) {
            errores.push("nombreLargo");
            errorNombre.innerHTML = "Debe tener cómo máximo 50 letras<br>";
            nombre.classList.add("error");
        }
        if(tieneNumeros(nombre.value.trim())) {
            errores.push("nombreConNumeros");
            errorNombre.innerHTML += "El nombre no puede contener números";
            nombre.classList.add("error");
        }

        // errores apellido: por lo menos 3 letras, máximo 50 letras, sin números
        if(apellido.value.trim().length < 3) {
            errores.push("apellidoCorto");
            errorApellido.innerHTML = "Debe tener al menos 3 letras<br>";
            apellido.classList.add("error");
        }
        if(apellido.value.trim().length > 50) {
            errores.push("apellidoLargo");
            errorApellido.innerHTML = "Debe tener cómo máximo 50 letras<br>";
            apellido.classList.add("error");
        }
        if(tieneNumeros(apellido.value.trim())) {
            errores.push("apellidoConNumeros");
            errorApellido.innerHTML += "El apellido no puede contener números";
            apellido.classList.add("error");
        }

        // errores password: debe tener al menos 8 dígitos, máximo 50, un número, una mayúscula, una minúscula y un caracter especial
        if(password.value.length < 8) {
            errores.push("passwordCorto");
            errorPassword.innerHTML = "Debe tener al menos 8 dígitos<br>";
            password.classList.add("error");
        }
        if(password.value.length > 50) {
            errores.push("passwordLargo");
            errorPassword.innerHTML = "Debe tener cómo máximo 50 dígitos<br>";
            password.classList.add("error");
        }
        if(!tieneNumeros(password.value)||!tieneLetraMayuscula(password.value)||!tieneLetraMayuscula(password.value)||!tieneCaracterEspecial(password.value)) {
            errores.push("passwordInsegura");
            errorPassword.innerHTML += "Debe tener al menos un número, una mayúscula,<br>una minúscula y un caracter especial"
            password.classList.add("error");
        }

        // errores password2: debe ser igual a password
        if(password2.value != password.value || password2.value == "") {
            errores.push("passwordsDistintas");
            errorPassword2.innerHTML = "Las contraseñas no coinciden";
            password2.classList.add("error");
        }

        // errores email: RegExp
        if(!emailRegExp.test(email.value.trim())) {
            errores.push("emailIncorrecto");
            errorEmail.innerHTML = "Ingrese un email válido";
            email.classList.add("error");
        }

        /* ------------------------------------
            Enviar datos a la api
        ------------------------------------ */
        if (errores.length == 0) {
            let data = {
                firstName: nombre.value,
                lastName: apellido.value,
                email: email.value,
                password: password.value,
            }


            fetch("https://ctd-todo-api.herokuapp.com/v1/users", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    if(typeof result === "string") {
                        errorRegistro.innerHTML = result;
                    } else {                 
                        mantenerIniciada.value == "on" ? sessionStorage.setItem("clave", JSON.stringify(result)) : localStorage.setItem("clave", JSON.stringify(result));
                        location.href = "index.html";
                    }  
                })
                .catch(error=> console.log(error))
        }
        
    })

})