// ******************************************************************************
// ****************************** VARIABLES ******************************
// ******************************************************************************
const inputMail = document.getElementById("email");
const inputPwd = document.getElementById("password");
const submitLogin = document.getElementById("submitLogin");
const displayError = document.getElementById("displayError");
let fetchResponse;
let dataToken;

// ******************************************************************************
// ****************************** FONCTIONS ******************************
const fetchLogin = async (login) => {
    fetchResponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
    });
    dataToken = await fetchResponse.json();
};

const checkInputLogin = () => {
    const regMail = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");

    if (regMail.test(inputMail.value) && inputPwd.value !== "") {
        submitLogin.classList.remove("unable");
        displayError.textContent = "";
    } else {
        submitLogin.classList.add("unable");
    }
};

inputMail.addEventListener("input", checkInputLogin);
inputPwd.addEventListener("input", checkInputLogin);

// ******************************************************************************
// ****************************** EVENEMENTS ******************************
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Création du Login pour fetch
    let login = {
        email: inputMail.value,
        password: inputPwd.value,
    };
    await fetchLogin(login);

    if (fetchResponse.ok) {
        // recupère le token => sessionStorage
        window.sessionStorage.setItem("token", dataToken.token);
        // rediection vers page index.html
        window.location.href = "index.html";
    } else {
        // Animation sur le bouton submit
        submitLogin.classList.add("loginError");
        setTimeout(() => submitLogin.classList.remove("loginError"), 300);
        // Ajout du texte d'erreur
        displayError.textContent = "E-mail et/ou Mot de passe incorrect(s)";
        inputPwd.value = "";
    }
});
