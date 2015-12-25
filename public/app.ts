interface Array<T> {
    findIndex(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): number;
}

interface Task {
    id: number,
    name: string,
    status: boolean
}
var allTasks: Task[] = [];
var input: HTMLInputElement;
var tasksBox: HTMLElement;
var controlPanel: HTMLElement;
var sortMode: string;
window.onload = () => {
    input = <HTMLInputElement>document.querySelector('#task')
    tasksBox = <HTMLElement>document.querySelector('#tasks-box');
    controlPanel = <HTMLElement>document.querySelector('#control-panel');
    tasksBox.addEventListener('click', (e) => {
        var target = <HTMLElement>e.target
        var taskNode = <HTMLElement>target.parentNode
        var dataset = <any>taskNode.dataset
        var className = target.classList[0];
        var index = allTasks.findIndex((task: Task):boolean =>{
            return task.id === parseInt(dataset.id, 10)
        })
        if (className === 'active-task' || className === 'unactive-task') {
            allTasks[index].status = !allTasks[index].status
        }
        if (className === 'task-remove') {
            allTasks.splice(index, 1)
        }
        renderTasks(tasksBox, allTasks, sortMode)
        renderControlPanel(controlPanel, allTasks)
    })
    controlPanel.addEventListener('click', (e) => {
        var target = <HTMLElement>e.target
        var curentClass = target.classList;
        var controls = controlPanel.children

        Array.prototype.forEach.call(controls, (control) => {
            let classList = control.classList
            classList.remove('active-control')
        })
        sortMode = null;
        if (curentClass[0] === 'get-active') {
            sortMode = 'get-active'
        }
        if (curentClass[0] === 'get-completed') {
            sortMode = 'get-completed'
        }
        renderTasks(tasksBox, allTasks, sortMode)
        curentClass.add('active-control')

    })
    input.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            addTask(tasksBox, { id: Date.now(), name: input.value, status: true });
            input.value = '';
            renderTasks(tasksBox, allTasks, sortMode)
            renderControlPanel(controlPanel, allTasks)
        }
    })
}


function renderTasks(tasksBox: HTMLElement, tasks: Task[], sortMode?: string) {
    var content: string = '';
    var currentTasks: Task[] = tasks;
    if (sortMode === 'get-active') {
        currentTasks = allTasks.filter((task: Task): boolean=> {
            return task.status;
        })
    }
    if (sortMode === 'get-completed') {
        currentTasks = allTasks.filter((task: Task): boolean=> {
            return !task.status;
        })
    }
    for (var task of currentTasks) {
        content += `<div class="full-task" data-id='${task.id}'>
        <span class="${task.status ? "active-task" : "unactive-task"}"></span>
        <span class="${task.status ? "task-name" : "task-name-line"}">${task.name}</span>
        <span class='task-remove'></span></div>`
    }
    tasksBox.innerHTML = content;
}
function renderControlPanel(controlPanel: HTMLElement, tasks: Task[]) {
    if (!tasks.length) {
        controlPanel.innerHTML = '';
        return;
    }
    var activeTask = tasks.filter((task: Task): boolean=> {
        return task.status;
    })
    var countMsg = `${activeTask.length} item left`
    if (tasks.length && controlPanel.children.length) {
        let countField = <HTMLElement>controlPanel.querySelector('.count');
        countField.innerHTML = countMsg;
        return;
    }
    var content: string = '';
    content += `
       <span class="count">${countMsg}</span>
       <span class="get-all controll active-control">All</span>
       <span class="get-active controll">Active</span>
       <span class="get-completed controll">Comleted</span>`
    controlPanel.innerHTML = content;
}

function addTask(tasksBox: HTMLElement, task: Task) {
    allTasks.push(task);
}