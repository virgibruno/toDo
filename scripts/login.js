const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

let jwt;


window.addEventListener("load", ()=> {
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
                        mantenerIniciada.value == "on" ? sessionStorage.setItem("clave", JSON.stringify(result)) : localStorage.setItem("clave", JSON.stringify(result));
                        location.href = "lista-tareas.html";
                    }  
                })
                .catch(error=> console.log(error))
                
            } else {
                errorLogin.innerHTML = "Ingrese un mail válido"
            }
        })
        
    })



