const setDate = () => {
    const dateDayElement = document.querySelector('.date-day');
    const monthNameElement = document.getElementById('monthName');
    const yearElement = document.querySelector('.date-month-year > span:last-of-type');
    const nameOfDayElement = document.querySelector('.date-day-name');

    let dayOfWeek = new Date().getDate();
    const year = new Date().getFullYear();
    const monthName = new Date().toLocaleDateString('en-en', { month: 'short' });
    const dayName = new Date().toLocaleDateString('en-en', { weekday: 'long' });

    if (dayOfWeek < 10) {
        dayOfWeek = `0${dayOfWeek}`;
    };
    
    dateDayElement.innerText = dayOfWeek;
    yearElement.innerText = year;
    monthNameElement.innerText = monthName;
    nameOfDayElement.innerText = dayName;
}

setDate();

let tasksList = [];

const toggleModal = () => {
    const modalElement = document.querySelector('.modal-overlay');
    modalElement.classList.toggle('hidden');
}

const displayModalBtnElement = document.querySelector('.add-task-btn');
displayModalBtnElement.addEventListener('click', toggleModal);

const closeBtnElement = document.querySelector('.close-modal-btn');
closeBtnElement.addEventListener('click', toggleModal);

const addTaskBtnContainer = document.querySelector('.add-task-btn-container');
const errorMessageParagraph = document.createElement('p');
const addTaskBtn = document.getElementById('addTask');


const setTaskCompleted = (taskId) =>{
   tasksList =  tasksList.map((task) =>{
       if (task.id === taskId){
           task.isCompleted = !task.isCompleted;
       }
       return task;
   } )
}

const renderTask = (task) => {
    // get element from HTML
    const taskListElement = document.querySelector('.tasks-list');

    // create element in JS
    const taskContainer = document.createElement('div');
    const taskContainerWithDelete = document.createElement('div');
    const deleteBtnContainer = document.createElement('span');
    const taskParagraph = document.createElement('p');
    const checkBtn = document.createElement('button');
    const checkIcon = document.createElement('i');
    const deleteBtn = document.createElement('button');
    const deleteIcon = document.createElement('i');

    taskContainerWithDelete.classList.add('task-conteiner-with-delete');
    deleteBtnContainer.classList.add('task-conteiner-with-delete-span');
    taskContainer.classList.add('task-container');
    deleteBtn.classList.add('delete-btn')
    taskParagraph.classList.add('task-container');

    checkBtn.classList.add('check-btn');
    checkIcon.classList.add('fas', 'fa-check');
    deleteIcon.classList.add('far', 'fa-trash-alt');

    if (task.isCompleted){
        taskContainer.classList.add('completed');
        deleteBtnContainer.classList.add('completed');
    }
    checkBtn.addEventListener('click', () =>{
     setTaskCompleted(task.id);
     taskDatasetId = taskContainer.dataset.id;
     taskDoneIndex = getIntexDoneTask(taskDatasetId);
    arraymove(taskDoneIndex);
    renderTasks();
    })

    taskParagraph.innerText = task.name;
    taskContainer.setAttribute('data-id',task.id);

    // created elements added to HTML
    taskListElement.appendChild(taskContainerWithDelete);
    taskContainerWithDelete.appendChild(deleteBtnContainer);
    deleteBtnContainer.appendChild(deleteBtn);
    deleteBtnContainer.appendChild(taskParagraph);
    taskContainerWithDelete.appendChild(taskContainer);
   
   // taskContainer.appendChild(taskParagraph);
    taskContainer.appendChild(checkBtn);
    checkBtn.appendChild(checkIcon);
    deleteBtn.appendChild(deleteIcon);

//    let taskDatasetId;
    
    taskParagraph.addEventListener('focus',()=>{
        deleteBtnContainer.classList.add('task-conteiner-with-delete-span:hover');
    })

    deleteBtn.addEventListener('click',()=>{
        taskDatasetId = taskContainer.dataset.id;
        deleteTask(taskDatasetId);     
    })
}

deleteTask = (taskId) => {
    for(let i=0; i<tasksList.length; i++){
        if(taskId === tasksList[i].id){
                tasksList.splice(i,1);    
        } 
    } 
    renderTasks();
}

function arraymove(fromIndex) {     
    var element = tasksList[fromIndex];
    tasksList.splice(fromIndex, 1);
    tasksList.push(element);
}

function getIntexDoneTask(taskId){
    for(let i=0; i<tasksList.length; i++){
        if(taskId === tasksList[i].id){
           return i;
        } 
    } 
}

const renderTasks = () => {
    // to reset previous state
    document.querySelector('.tasks-list').innerHTML = null
    tasksList.forEach((task) => {
            renderTask(task);
    })
}

const validateTask = (taskName) => {
    if (!taskName.trim()) {
        return 'Task name is required'
    }

    if (taskName.length < 4) {
        return 'Min 3 characters'
    }
    return;
}

const addTaskToModel = (taskInput) => {
    const task = {
        name: taskInput.value,
        isCompleted: false,
        id: Math.random().toString()
    };

    tasksList.unshift(task);
    taskInput.value = '';
}



function addErrorMessage(message){
    errorMessageParagraph.innerText = message; 
    addTaskBtn.before(errorMessageParagraph);
    addTaskBtnContainer.classList.add('add-task-btn-container-error')
}

function clearErrorMessage(){
    errorMessageParagraph.innerText = '';
}

let errParExists = false;

const addTaskBtnElement = document.getElementById('addTask');
addTaskBtnElement.addEventListener('click', () => {
    const taskNameInputElement = document.getElementById('taskName');
    
    if (validateTask(taskNameInputElement.value)) {
        taskNameInputElement.classList.add('input-error');
        let message = (validateTask(taskNameInputElement.value));
        if((!errParExists) || (message!==errorMessageParagraph.innerText)){
            addErrorMessage(message);
            errParExists = true;
        }
        return;
    }
    
    addTaskToModel(taskNameInputElement);

    renderTasks();
   
    taskNameInputElement.classList.remove('input-error')
    
    clearErrorMessage();
   
    errParExists = false;
    toggleModal();
})
