// ******************************************************************************
// ***************************** NOTES PERSO  ******************************
// ******************************************************************************
/* {
    - Supprimer les addEventListener de la modal lors de la fermeture de la modale et ou de la session admin 
    - creer 2 fonctions pour la creation des modales par injection SI token
    fonction à jouer dans displayAdmin ???? 
    ------->>>>>> P**** de refresh lors du fetch postWorks et fetch deleteWorks
} */

// ******************************************************************************
// ***************************** FONCTION INDEX ******************************
// ******************************************************************************

const fetchWorks = async () => {
    try {
        const res = await fetch("http://localhost:5678/api/works");
        const dataWorks = await res.json();
        return dataWorks;
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
    }
};

const fetchCategories = async () => {
    try {
        const res = await fetch("http://localhost:5678/api/categories");
        const dataCategories = await res.json();
        return dataCategories;
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
    }
};

const displayWorks = (arrayWorks) => {
    const gallery = document.querySelector("#gallery");
    // console.log(arrayWorks);

    // Suppression des éléments présents dans la Galerie
    gallery.innerHTML = ""

    // Création des travaux et ajout au DOM
    arrayWorks.forEach((work) => {
        // Création des différents stravaux
        const workTag = document.createElement("figure");
        workTag.classList.add("workContainer");
        const workImage = document.createElement("img");
        workImage.setAttribute("src", work.imageUrl);
        workImage.setAttribute("alt", `Photo ${work.title}`);
        const workTitle = document.createElement("figcaption");
        workTitle.textContent = work.title;

        // intégration des travaux au DOM
        workTag.appendChild(workImage);
        workTag.appendChild(workTitle);
        gallery.appendChild(workTag);
    });
};

const filtersWorks = (arrayCategories, arrayWorks) => {
    const filters = document.querySelector("#filters");

    // créé et affiche les boutons filtres
    if (arrayCategories.length > 1) {
        // On ajoute un bouton "TOUT"
        const allBtn = document.createElement("button");
        allBtn.classList.add("btnFilter", "activeFilter");
        allBtn.setAttribute("id", "0");
        allBtn.textContent = "Tout";
        filters.appendChild(allBtn);

        // On ajoute les boutons "Catégories"
        arrayCategories.forEach((category) => {
            const filterBtn = document.createElement("button");
            filterBtn.classList.add("btnFilter");
            filterBtn.setAttribute("id", category.id);
            filterBtn.textContent = category.name;
            filters.appendChild(filterBtn);
        });
    }
    const filterButtons = document.querySelectorAll(".btnFilter");

    // on filtre et on affiche les 'works'
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const selectBtn = e.target; 
            const selectID = parseInt(btn.id);
            
            // affichage du filtre selectionné 
            filterButtons.forEach(btn => {
                btn.classList.remove('activeFilter')
                selectBtn.classList.add('activeFilter')                
            })

            if (selectID === 0) {
                displayWorks(arrayWorks);
            }

            if (selectID > 0) {
                const filteredWorks = arrayWorks.filter(
                    (work) => work.categoryId === selectID
                );

                displayWorks(filteredWorks);
            }
        });
    });
};

const displayAdminIndex = () => {
    // affiche la banner
    editBanner.style.display = "";

    // LOGIN > LOGOUT
    logBtn.textContent = "logout";
    logBtn.style.fontWeight = "700";
    logBtn.href = "javascript:void(0)";

    // affiche le bouton "modifier"
    openModalBtn.style.display = "";

    // Masquage filters Buttons
    filters.style.display = "none";

    // fermeture de la session Admin
    logBtn.addEventListener("click", () => {
        sessionStorage.removeItem("token");
        // masque la banner
        editBanner.style.display = "none";

        // LOGOUT > LOGIN
        logBtn.textContent = "login";
        logBtn.style.fontWeight = "";
        logBtn.href = "";

        // affiche le bouton "modifier"
        openModalBtn.style.display = "none";

        // Masquage filters Buttons
        filters.style.display = "";
    });
};

const checkInputContact = () => {
    const regName = new RegExp("^[a-zA-Z]+$");
    const regMail = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    const errorText = document.querySelector(".formContactError");

    if (
        regName.test(nameContact.value) &&
        regMail.test(emailContact.value) &&
        messageContact.value !== ""
    ) {
        sumbmitBtn.classList.remove("unable");
        errorText.textContent = "";
        validContactForm = true;
    } else {
        sumbmitBtn.classList.add("unable");
        validContactForm = false;
    }
};

const submitMessageContact = () => {
    const displayError = document.querySelector(".formContactError");
    const errorText = document.querySelector(".formContactError");

    if (validContactForm) {
        const sentMessage = `Merci ${nameContact.value}, votre message à bien été envoyé.`;
        const body = `
                Nom : ${nameContact.value} 
                email : ${emailContact.value} 
                ------- 
                Message : ${messageContact.value}
            `;
        console.log(body);
        alert(sentMessage);

        // Reset du formulaire
        nameContact.value = "";
        emailContact.value = "";
        messageContact.value = "";
        validContactForm = false;
        sumbmitBtn.classList.add("unable");
    } else {
        // Shake le bouton
        sumbmitBtn.classList.add("shake");
        displayError.textContent = "Veuillez compléter tous les champs";
        setTimeout(() => {
            sumbmitBtn.classList.remove("shake");
        }, 300);

        // ajout d'un message d'erreur
        errorText.textContent = "Veuillez remplir tous les champs";
    }
};

// ******************************************************************************
// ***************************** FONCTION MODALE ******************************
// ******************************************************************************

//////////////////////////////// DISPLAY MODAL ////////////////////////////////
const displayModal = () => {
    const openModalBtn = document.querySelector("#openModalBtn"); // modifier
    const closeBtn = document.querySelector("#closeBtn");
    const addWorksBtn = document.querySelector("#addWorksBtn"); // ajouter photo

    // ouvre la modale
    openModalBtn.addEventListener("click", showModalGallery);

    // ouvre la modale 'addwork'
    addWorksBtn.addEventListener("click", showModalAddWork);

    // ferme la modale
    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(e);
        }
    });
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            closeModal();
        }
    });
};

const showModalGallery = async () => {
    const modal = document.querySelector("#modal");
    const modalGallery = document.querySelector("#modalGallery");
    const modalAddWork = document.querySelector("#modalAddWork");
    const thumbnailsContainer = document.querySelector(".thumbnails");
    const prevBtn = document.querySelector("#prevBtn");

    // stop scroll sur body
    document.body.style.overflowY = "hidden";

    // display de la modale
    modal.style.display = "";
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");

    // affiche modalGallery & masque modalAddWork
    modalGallery.style.display = "block";
    modalAddWork.style.display = "none";
    // change le titre de la modale
    modalTitle.textContent = "Galerie photo";
    // masque le previousButton
    prevBtn.classList.remove("fa-arrow-left");

    // charge les miniatures
    // On efface le contenu de la gallery
    thumbnailsContainer.innerHTML = "";

    // on ajoute les travaux

    const dataWorks = await fetchWorks(); ///////////////////////////////////////////////////////////////////////////// WTF
    dataWorks.forEach((work) => {
        const thumbnail = document.createElement("div");
        thumbnail.classList.add("thumbnail");
        thumbnail.setAttribute("data-workId", work.id);
        thumbnailsContainer.appendChild(thumbnail);

        const image = document.createElement("img");
        image.setAttribute("src", work.imageUrl);
        image.setAttribute("alt", `Photo de ${work.title}`);

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can", "deleteWorkBtn");
        icon.setAttribute("data-id", work.id);

        thumbnail.appendChild(image);
        thumbnail.appendChild(icon);
    });
};

const showModalAddWork = async () => {
    const modalGallery = document.querySelector("#modalGallery");
    const modalAddWork = document.querySelector("#modalAddWork");
    const prevBtn = document.querySelector("#prevBtn");
    const formTitle = document.getElementById("formTitle");
    const formCategory = document.getElementById("formCategory");
    const submitWorks = document.querySelector(".submitWorks");
    const previewImg = document.querySelector(".previewImg");

    // masque modalGallery & affiche modalAddWork
    modalGallery.style.display = "none";
    modalAddWork.style.display = "block";
    // change le titre de la modale
    modalTitle.textContent = "Ajout photo";
    // affiche le previousButton
    prevBtn.classList.add("fa-arrow-left");

    // recupere les categories distantes et les affiches
    const dataCategories = await fetchCategories();

    while (formCategory.firstChild) {
        formCategory.firstChild.remove();
    }
    const defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "0");
    defaultOption.setAttribute("disabled", true);
    defaultOption.setAttribute("selected", true);
    defaultOption.setAttribute("hidden", true);
    formCategory.appendChild(defaultOption);

    dataCategories.forEach((category) => {
        const catOption = document.createElement("option");
        catOption.textContent = category.name;
        catOption.setAttribute("value", category.id);
        formCategory.appendChild(catOption);
    });

    // initialise le formulaire
    // imgSrc = null;
    formTitle.value = "";
    formCategory.value = "0";
    previewImg.src = "";
    addImgContainer.style.display = "";
    previewImg.style.display = "none";
    submitWorks.classList.add("unable");

    // affiche modale Gallery (retour)
    prevBtn.addEventListener("click", showModalGallery);
};

const closeModal = async () => {
    // activation scroll sur body
    document.body.style.overflowY = "";

    // MASQUER LA MODALE
    window.setTimeout(() => {
        modal.style.display = "none";
    }, 300); // on attend la fin de l'anmation de sortie avant de masquer
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");

    const newDataWork = await fetchWorks();
    displayWorks(newDataWork); ///////////////////////////////////////////////////////////////////////////// WTF
};

///////////////////////////// ADD / DELETE WORK /////////////////////////////
const addWork = (token) => {
    const addWorksForm = document.querySelector("#addWorksForm");
    const formTitle = document.querySelector("#formTitle");
    const formCategory = document.querySelector("#formCategory");
    const fileInput = document.querySelector("#fileInput");
    const submitWorks = document.querySelector(".submitWorks");
    const displayError = document.querySelector(".displayError");
    let selectedFile;
    let imgSrc = null;
    let validDataToAdd = false;

    // Ajout de l'image / preview
    fileInput.addEventListener("input", (e) => {
        const addImgContainer = document.querySelector("#addImgContainer");
        const previewImg = document.querySelector(".previewImg");
        const imgSize = document.querySelector(".imgContainer__add__text");
        [selectedFile] = e.target.files;
        imgSrc = e.target.value;

        if (selectedFile !== null) {
            if (selectedFile.size <= 4194304) {
                // affichage de la preview
                addImgContainer.style.display = "none";
                previewImg.style.display = "";
                previewImg.src = URL.createObjectURL(selectedFile);
                imgSize.style.color = "rgb(0,0,0)";
            } else {
                imgSize.style.color = "rgb(200,0,0)";
                imgSize.classList.add("shake");
                setTimeout(() => {
                    imgSize.classList.remove("shake");
                }, 300);
            }
        }
    });

    // vérifie les données entrées
    const validateFormAddWork = () => {
        displayError.textContent = "";
        if (
            imgSrc !== null &&
            formTitle.value !== "" &&
            formCategory.value !== "0"
        ) {
            submitWorks.classList.remove("unable");
            validDataToAdd = true;
        } else {
            submitWorks.classList.add("unable");
            validDataToAdd = false;
        }
    };
    fileInput.addEventListener("change", validateFormAddWork);
    formTitle.addEventListener("input", validateFormAddWork);
    formCategory.addEventListener("change", validateFormAddWork);

    // soumettre le formulaire
    addWorksForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (validDataToAdd) {
            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("title", formTitle.value);
            formData.append("category", formCategory.value);

            await fetchPostWork(token, formData);
            const newDataWork = await fetchWorks;
            showModalGallery(newDataWork);
            // displayWorks(newDataWork)///////////////////////////////////////////////////////////////////////////// WTF
        } else {
            displayError.textContent = "Veuillez compléter tous les champs";
            submitWorks.classList.add("shake");
            setTimeout(() => {
                submitWorks.classList.remove("shake");
            }, 300);
        }
    });
};

const deleteWork = async (token) => {
    const thumbnails = document.querySelector(".thumbnails");

    thumbnails.addEventListener("click", async (e) => {
        e.preventDefault();
        if (e.target.classList.contains("deleteWorkBtn")) {
            const idToDelete = parseInt(e.target.dataset.id);
            console.log("test 3");
            fetchDeleteWork(token, idToDelete);

            const newDataWork = await fetchWorks;
            showModalGallery(newDataWork);
            // displayWorks(newDataWork)///////////////////////////////////////////////////////////////////////////// WTF
        }
    });
};

const fetchPostWork = async (token, formData) => {
    try {
        await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
    }
};

const fetchDeleteWork = async (token, id, e) => {
    console.log("test 1");
    try {
        const res = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            console.log("ok");
        }
        console.log("test 2");
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
    }
    e.preventDefault();
};

// ******************************************************************************
// ******************************** INIT ********************************
// ******************************************************************************
const init = async () => {
    // recupère les datas WORKS et CATEGORIES distants
    const dataCategories = await fetchCategories();
    const dataWorks = await fetchWorks();

    // affiche les traveaux et filtres sur l'index
    displayWorks(dataWorks);
    filtersWorks(dataCategories, dataWorks);
    // Formulaire
    nameContact.addEventListener("input", checkInputContact);
    emailContact.addEventListener("input", checkInputContact);
    messageContact.addEventListener("input", checkInputContact);
    formContact.addEventListener("submit", (e) => {
        e.preventDefault();
        submitMessageContact();
    });

    // Display Mode admin si token present et init modal
    const token = sessionStorage.getItem("token");
    if (token !== null) {
        displayAdminIndex();
        displayModal();
        addWork(token);
        deleteWork(token);
    }
};
init();
