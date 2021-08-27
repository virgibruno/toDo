const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

let jwt;


window.addEventListener("load", event => {

    // redirigir a página de tareas si ya está la sesión iniciada
    if (sessionStorage.getItem("clave") !== null || localStorage.getItem("clave") !== null) {
        event.preventDefault();
        location.href = "./index.html"
    }

    // capturar elementos formulario
    const formularioLogin = document.querySelector("#login");
    const password = document.querySelector("#password");
    const email = document.querySelector("#email");
    const errorLogin = document.querySelector("#errorLogin");
    const mantenerIniciada = document.querySelector("input.checkbox");
    
    
    formularioLogin.addEventListener("submit", e=> {
        e.preventDefault();
        
        
        if (emailRegExp.test(email.value.trim())){
            
            let data = {
                email: email.value,
                password: password.value,
            }
            
            fetch("https://ctd-todo-api.herokuapp.com/v1/users/login", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())   
                .then(result => {
                    if(typeof result === "string") {
                        errorLogin.innerHTML = result;
                    } else {                 
                        mantenerIniciada.value == "on" ? localStorage.setItem("clave", JSON.stringify(result)) : sessionStorage.setItem("clave", JSON.stringify(result));
                        location.href = "index.html";
                    }  
                })
                .catch(error=> console.log(error))
                
            } else {
                errorLogin.innerHTML = "Ingrese un mail válido"
            }
        })
        
    })



