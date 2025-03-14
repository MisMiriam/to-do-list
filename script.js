// Buttons
const btnAdd = document.querySelector('.btn-svg-add');
const btnExit = document.querySelector('.btn-svg-exit');
const btnLogout = document.getElementById('logout-btn');
const btnDateSort = document.getElementById('sort-date');
const btnStateSort = document.getElementById('sort-state');
// Forms
const loginForm = document.getElementById('form-signin');
const email = document.getElementById('form-signin-email');
const password = document.getElementById('form-signin-password');

const addTaskForm = document.getElementById('add-task-form');
const stateSpan = document.querySelector('#add-task-form .task-to-do');
const dateSpan = document.getElementById('form-task-date');
const titleSpan = document.getElementById('form-task-title');
const textSpan = document.getElementById('form-task-text');
// DOM
const loginContainer = document.querySelector('.modal-singin');
const addTaskContainer = document.querySelector('.add-task-container');
const userName = document.querySelector('.profil');
const setupTask = document.querySelector('setup-task');
const task = document.querySelector('.task');
const completeTasks = document.querySelector('.complete');

/* état de connexion de l'utilisateur */
let sessionStart = false;
/* information de l'utilisateur connecté: email, mot de passe */
let connectedUser = {
    email: '',
    password: ''
};
/* formulaire de connexion */
loginForm.addEventListener('submit',(e) =>{
    e.preventDefault();
    let emailRegExp = /^\S+@\S+\.\S+$/gm;
    if(email.value === '' && password.value === ''){
        console.log("Ne pas laissez de champs vide !");
    }else if(!emailRegExp.test(email.value)){
        console.log("Format de l'email incorrecte");
    }else if(password.value.length < 4){
        console.log('Mot de passe trop court !');
    }else{
        /* connecte l'utilisateur */
        userLogin(email.value.trim(),password.value.trim());
        sessionStart = true;
        console.log("Vous êtez connecté");
        userName.innerHTML = `Bienvenue ${connectedUser.email} !`;
        loginContainer.classList.add('hide');
        task.classList.remove('hide');
        if(localStorage.getItem('tasks') === null){
            console.log('Aucune tâche à récupérer!');
        }else{     
            /* affiche la liste des tâches créée par l'utilisateur */
            let taskTab = JSON.parse(localStorage.getItem('tasks'));
            let findTask = taskTab.filter(task => task.user === connectedUser.email);
            if(findTask){
                findTask.forEach(task =>{
                    /* crée une liste avec la tâche dans le html */
                    switch (task.state) {
                        case 'En cours':
                            createLi(task.state, 'task-ongoing', task.date, task.title, task.text);
                            break;
                        case 'Fini':
                            createLi(task.state, 'task-complete', task.date, task.title, task.text);
                            break;
                    
                        default:
                            createLi(task.state, 'task-to-do', task.date, task.title, task.text);
                            break;
                    }
                });
                let lists = document.querySelectorAll('.task li');
                for(let i = 0; i < lists.length; i ++){
                    let btnOngoing = lists[i].children[0].lastElementChild.firstElementChild;
                    let btnComplete = lists[i].children[0].lastElementChild.lastElementChild;
                    let btnDelete = lists[i].parentElement.lastElementChild;
                    btnOngoing.addEventListener('click',()=>{
                        btnOngoing.parentElement.previousElementSibling.classList.forEach(btnClass =>{
                            if(btnClass !== 'task-state'){
                                updateState(lists[i],btnOngoing.innerText,btnClass,'task-ongoing');
                            }
                        });
                    });
                    btnComplete.addEventListener('click',()=>{
                        btnComplete.parentElement.previousElementSibling.classList.forEach(btnClass =>{
                            if(btnClass !== 'task-state'){
                                updateState(lists[i],btnComplete.innerText,btnClass,'task-complete');
                            }
                        });
                        /* désactive le bouton supprimer */
                        btnDelete.remove();
                        /* désactive le changement de l'état */
                        lists[i].firstElementChild.lastElementChild.remove();
                        // updateState(lists[i],btnComplete.innerText,'task-complete');
                        lists[i].classList.replace('li-updated','li-archived');
                        completeTasks.classList.remove('hide');
                        task.removeChild(lists[i].parentElement);
                        completeTasks.appendChild(lists[i].parentElement);
                    });
                    btnDelete.addEventListener('click',() =>{
                        lists[i].parentElement.remove();
                        /* cherche la tâche à supprimer dans localStorage */
                        let taskTab = JSON.parse(localStorage.getItem('tasks'));
                        let findTask = taskTab.find(task =>
                            task.user === connectedUser.email &&
                            task.state === lists[i].children[0].firstElementChild.innerText &&
                            task.date === lists[i].children[1].innerText &&
                            task.title === lists[i].children[2].innerText &&
                            task.text === lists[i].children[3].innerText
                        );
                        if(findTask){
                            taskTab.splice(taskTab.indexOf(findTask),1);
                            localStorage.setItem('tasks',JSON.stringify(taskTab));
                        }
                    });
                }
            }
        }
    }
    email.value = '';
    password.value = '';
});
/* bouton de déconnexion */
btnLogout.addEventListener('click', () =>{
    sessionStart = false;
    connectedUser.email = '';
    connectedUser.password = '';
    task.classList.add('hide');
    task.innerHTML = '';
    completeTasks.classList.add('hide');
    completeTasks.innerHTML = '';
    loginContainer.classList.remove('hide');
    console.log('Vous êtes déconnecté !');
});
/* boutons de tri des tâches */
btnStateSort.addEventListener('click',()=>{
    let states = [];
    /* ajoute la date dans un tableau */
    let lists = document.querySelectorAll('.task .task-container');
    lists.forEach(li => {
        states.push(li.children[0].firstElementChild.firstElementChild.innerText);
    });
    let sortedState = states.sort();
    /* si l'état de la tâche du tableau et la même que l'état de la liste, efface la liste et la remet dans l'ordre */
    for(let y = 0; y < sortedState.length; y++){
        for(let x = 0; x < lists.length; x++){
            let liState= lists[x].children[0].firstElementChild.firstElementChild.innerText;
            if(sortedState[y] == liState){
                lists[x].remove();
                task.appendChild(lists[x]);
            }
        }
    }
});
btnDateSort.addEventListener('click',() => {
    let dates = [];
    /* ajoute la date dans un tableau */
    let lists = document.querySelectorAll('.task .task-container');
    lists.forEach(li => {
        dates.push(li.children[0].children[1].innerText);
    });
    let sortedDate = dates.sort();
    /* si la date du tableau et la même que la date de la liste, efface la liste et la remet dans l'ordre */
    for(let y = 0; y < sortedDate.length; y++){
        for(let x = 0; x < lists.length; x++){
            let liDate = lists[x].children[0].children[1].innerText;
            if(sortedDate[y] == liDate){
                lists[x].remove();
                task.appendChild(lists[x]);
            }
        }
    }
});
/* bouton pour afficher le formulaire d'ajout d'une tâche */
btnAdd.addEventListener('click', () =>{
    addTaskContainer.classList.remove('hide');
    minDate();
});
/* bouton pour sortir du formulaire d'ajout d'une tâche, 
affiche un message de confirmation si l'utilisateur à commencer à entrer des informations */
btnExit.addEventListener('click', () =>{
    // let dateSpan = document.getElementById('form-task-date');
    // let titleSpan = document.getElementById('form-task-title');
    // let textSpan = document.getElementById('form-task-text');
    if(dateSpan.value !== '' || 
        titleSpan.value !== '' || 
        textSpan.value !== ''){
        let exitMsg = confirm('Attention, les informations non sauvegardé seront supprimés !');
        if(exitMsg){
            addTaskContainer.classList.add('hide');
            dateSpan.value = '';
            titleSpan.value = '';
            textSpan.value = '';
        }
    }else{
        addTaskContainer.classList.add('hide');
        dateSpan.value = '';
        titleSpan.value = '';
        textSpan.value = '';
    }
});
addTaskForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let titleRegExp = /[-'a-zA-ZÀ-ÖØ-öø-ÿ0-9\u0020]+/g;
    // let stateSpan = task.children[0].children[0].firstElementChild.innerText;
    // console.log(stateSpan);
    
    if(dateSpan.value === '' || titleSpan.value === ''){
        console.log('Ne pas laissez de champ vide');
    }else if(!titleRegExp.test(titleSpan.value.trim())){
        console.log("format titre incorrecte");
    }else{
        /* crée une liste avec la tâche */
        createLi('A faire', 'task-to-do',
                dateSpan.value.trim(),
                titleSpan.value.trim(),
                textSpan.value.trim());
        /* ajouter la tâche à localStorage */
        saveTask(stateSpan.innerText,
                dateSpan.value.trim(),
                titleSpan.value.trim(),
                textSpan.value.trim());
        let lists = document.querySelectorAll('.task li');
        for(let i = 0; i < lists.length; i ++){
            let btnOngoing = lists[i].children[0].lastElementChild.firstElementChild;
            let btnComplete = lists[i].children[0].lastElementChild.lastElementChild;
            let btnDelete = lists[i].parentElement.lastElementChild;
            btnOngoing.addEventListener('click',()=>{
                btnOngoing.parentElement.previousElementSibling.classList.forEach(btnClass =>{
                    if(btnClass !== 'task-state'){
                        updateState(lists[i],btnOngoing.innerText,btnClass,'task-ongoing');
                    }
                });
            });
            btnComplete.addEventListener('click',()=>{
                btnOngoing.parentElement.previousElementSibling.classList.forEach(btnClass =>{
                    if(btnClass !== 'task-state'){
                        updateState(lists[i],btnComplete.innerText,btnClass,'task-complete');
                    }
                });
                /* désactive le bouton supprimer */
                btnDelete.remove();
                /* désactive le changement de l'état */
                lists[i].firstElementChild.lastElementChild.remove();
                // updateState(lists[i],btnComplete.innerText,'task-complete');
                lists[i].classList.replace('li-updated','li-archived');
                completeTasks.classList.remove('hide');
                task.removeChild(lists[i].parentElement);
                completeTasks.appendChild(lists[i].parentElement);
            });
            btnDelete.addEventListener('click',() =>{
                lists[i].parentElement.remove();
                /* cherche la tâche à supprimer dans localStorage */
                let taskTab = JSON.parse(localStorage.getItem('tasks'));
                let findTask = taskTab.find(task =>
                    task.user === connectedUser.email &&
                    task.state === lists[i].children[0].firstElementChild.innerText &&
                    task.date === lists[i].children[1].innerText &&
                    task.title === lists[i].children[2].innerText &&
                    task.text === lists[i].children[3].innerText
                );
                if(findTask){
                    taskTab.splice(taskTab.indexOf(findTask),1);
                    localStorage.setItem('tasks',JSON.stringify(taskTab));
                }
            });
        }
    }
    /* remet le formulaire à 0 */
    dateSpan.value = '';
    titleSpan.value = '';
    textSpan.value = '';
    addTaskContainer.classList.add('hide');
});
/* ************************************************ */
// Fonctions
/**
 * Créer, enregistrer ou récupérer les informations de connexion de l'utilisateur
 * 
 * @param {String} email - l'email de l'utilisateur
 * @param {String} password -,le mot de passe de l'utilisateur
 * @returns - l'email et le mot de passe de l'utilisateur connecté dans connectedUser{}
 */
function userLogin(email, password){
    /* crée un tableau ou récupérer la clé 'users' avec les données de l'utilisateur */
    let usersTab =JSON.parse(localStorage.getItem('users')) || [];
    /* vérifie si l'email et le mot de passe existe dans localStorage */
    let userExists = usersTab.find(user => 
        user.email === email && 
        user.password === password);
    /* vérifie si l'email est déjà utilisé */
    let emailExists = usersTab.some(user => user.email === email);
    if(userExists){
        return connectedUser.email = email,
            connectedUser.password = password;
    }else if(emailExists){
        console.log("L'email est déjà utilisé");
    }else{
        let obj = {
            email: email, 
            password: password
        };
        usersTab.push(obj);
        /* enregistre l'utilisateur dans localStorage */
        localStorage.setItem('users', JSON.stringify(usersTab));
        return connectedUser.email = email,
            connectedUser.password = password;
    }
}
/**
 * Bloque la sélection de la date du formulaire à partir de la date du jour
 */
function minDate(){
    // Récupère la date du jour
    let d = new Date();
    // Convertit la date au format ISO (YYYY-MM-DDTHH:MM:SSZ)
    let dateISO = d.toISOString();
    // Récupère seulement la date (YYYY-MM-DD)
    let id = dateISO.indexOf('T');
    let minDate = dateISO.slice(0,id);
    let taskDate = document.getElementById('form-task-date');
    taskDate.min = minDate;
}
/**
 * Affiche la date au format (DD/MM/YYYY)
 */
function displayDate(date){
    let d = new Date(date);
    return d.toLocaleDateString();
}
/**
 * Créer un bouton à partir des images .svg
 * 
 * @param {string} btnAttribute :type = ['button','submit','reset']
 * @param {string} btnClass :nom du bouton = ['add','edit','trash','save','exit']
 * @param {string} imgName : nom de l'image = ['ajouter','modifier','supprimer','sauvegarder','annuler']
 * @param {number} dimension :width et height
 */
function createBtn(btnAttribute,btnClass,imgName,dimension){
    let btn = document.createElement('button');
    //    Ajoute un type à <button>
    btn.setAttribute('type', btnAttribute);
    //    Ajoute des classes à <button>
    btn.classList.add('btn-svg','btn-hide-text',`btn-svg-${btnClass}`);
    // Créé un élément object
    btn.innerHTML = `<object 
    data="btn_${imgName}.svg" 
    type="image/svg+xml" 
    width="${dimension}" 
    height="${dimension}">
    </object> 
    ${imgName}`;
    return btn;
}
/**
 * Créer une li de la tâche
 * 
 * @param {String} state - l'état de la tâche (A faire, En cours ou Fini)
 * @param {Date} date - la date de la tâche à effectuer
 * @param {String} title - le titre de la tâche
 * @param {String} text - une description de la tâche
 */
function createLi(state, stateClass,date,title,text=''){
    /* crée une div qui contient la liste */
    let div = document.createElement('div');
    div.classList.add('task-container');
    /* crée une liste avec la tâche */
    let li = document.createElement('li');
    li.classList.add('li-task','li-updated');
    li.innerHTML = `
    <div class="dropdown">
        <span class="task-state ${stateClass}">${state}</span>
    </div>
    <span>${date}</span>
    <span>${title}</span>
    <span>${text}</span>`;
    div.appendChild(li);
    /* classe les tâches finies dans ul.complete */
    if(state === 'Fini'){
        /* déplace la tâche dans la liste des tâches finies */
        li.classList.replace('li-updated','li-archived');
        completeTasks.classList.remove('hide');
        completeTasks.appendChild(div);
    }else{
        /* crée un menu dropdown avec 2 boutons */
        let btnsDiv = document.createElement('div');
        btnsDiv.classList.add('dropdown-state');
        btnsDiv.innerHTML = `
        <span class="task-state task-ongoing">En cours</span>
        <span class="task-state task-complete">Fini</span>`;
        li.firstElementChild.appendChild(btnsDiv);
        /* crée un bouton supprimer */
        let delBtn = createBtn('button','trash','supprimer',30);
        div.appendChild(delBtn);
        task.appendChild(div);
    }
}
/**
 * Sauvegarder une tâche dans localStorage
 * 
 * @param {String} stateValue - l'état de la tâche
 * @param {Date} dateValue - la date de la tâche à effectuer
 * @param {String} titleValue - le titre de la tâche
 * @param {String} textValue - une description de la tâche
 */
function saveTask(stateValue, dateValue, titleValue, textValue){
    /* ajouter la tâche à localStorage */
    let taskTab = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskObj = {
        user: connectedUser.email,
        state: stateValue,
        date: dateValue,
        title: titleValue,
        text: textValue
    };
    taskTab.push(taskObj);
    localStorage.setItem('tasks', JSON.stringify(taskTab));
}
/**
 * Modifier l'état d'une tâche
 * 
 * @param {HTMLElement} li - la li à récupérer
 * @param {String} newState - le nouvel état de la tâche
 */
function updateState(li,newState, oldStateClass,newStateClass){
    let taskTab = JSON.parse(localStorage.getItem('tasks'));
    let findTask = taskTab.find(task =>
        task.user === connectedUser.email &&
        task.state === li.children[0].firstElementChild.innerText &&
        task.date === li.children[1].innerText &&
        task.title === li.children[2].innerText &&
        task.text === li.children[3].innerText
    );
    /* récupère l'id de la liste */
    let idTask = taskTab.indexOf(findTask);
    if(findTask){
        /* modifie l'état de la tâche dans le html */
        li.children[0].firstElementChild.innerText = newState;
        li.children[0].firstElementChild.classList.replace(oldStateClass, newStateClass);
        /* modifie l'état de la tâche dans localStorage */
        findTask.state = newState;
        taskTab[idTask] = findTask;
        localStorage.setItem('tasks',JSON.stringify(taskTab));
    }
}