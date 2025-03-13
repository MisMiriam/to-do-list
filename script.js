// Buttons
const btnAdd = document.querySelector('.btn-svg-add');
const btnExit = document.querySelector('.btn-svg-exit');
const btnLogout = document.getElementById('logout-btn');
const btnDateSort = document.getElementById('sort-date');
const btnStateSort = document.getElementById('sort-state');
// Forms
const loginForm = document.querySelector('#login form');
const addTaskForm = document.querySelector('.add-task-container form');
// DOM
const addTaskContainer = document.querySelector('.add-task-container');
const userName = document.querySelector('.profil');
const ul = document.querySelector('.task');
const completeTasks = document.querySelector('.complete');

/* état de connexion de l'utilisateur */
let sessionStart = false;
/* information de l'utilisateur connecté: email, mot de passe */
let connectedUser = {
    email: '',
    password: ''
};