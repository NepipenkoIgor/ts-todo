interface Array<T> {
    findIndex(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): number;
}

interface Task {
    id: number,
    name: string,
    status: boolean
}
let allTasks: Task[] = [];
let input: HTMLInputElement;
let tasksBox: HTMLElement;
let controlPanel: HTMLElement;
let sortMode: string;
window.onload = () => {
    input = <HTMLInputElement>document.querySelector('.task-input')
    tasksBox = <HTMLElement>document.querySelector('.tasks-box');
    controlPanel = <HTMLElement>document.querySelector('.control-panel');
    tasksBox.addEventListener('click', (e) => {
        let target = <HTMLElement>e.target
        let taskNode = <HTMLElement>target.parentNode
        let dataset = <any>taskNode.dataset
        let className = target.classList[0];
        if (className === 'task-name' || className === 'task-name-line') {
            Array.prototype.forEach.call(tasksBox.children, (taskNode) => {
                let input = taskNode.querySelector('input')
                input.setAttribute('disabled', 'true')
            })
            target.removeAttribute('disabled')
            return;
        }
        let index = allTasks.findIndex((task: Task): boolean => {
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
        let target = <HTMLElement>e.target
        let curentClass = target.classList;
        let controls = controlPanel.children;
        if(curentClass[0] === 'count'){
            return;
        }
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
    tasksBox.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            let target = <HTMLInputElement>e.target;
            let taskNode = <HTMLElement>target.parentNode;
            let dataset = <any>taskNode.dataset;
            let index = allTasks.findIndex((task: Task): boolean => {
                return task.id === parseInt(dataset.id, 10)
            })
            allTasks[index].name = target.value;
            target.setAttribute('disabled', 'true')
        }
    })
    input.addEventListener('keypress', (e) => {
        if (e.keyCode === 13&&input.value) {
            addTask(tasksBox, { id: Date.now(), name: input.value, status: true });
            input.value = '';
            renderTasks(tasksBox, allTasks, sortMode)
            renderControlPanel(controlPanel, allTasks)
        }
    })
}


function renderTasks(tasksBox: HTMLElement, tasks: Task[], sortMode?: string) {
    let content: string = '';
    let currentTasks: Task[] = tasks;
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
    for (let task of currentTasks) {
        content += `<div class="full-task" data-id='${task.id}'>
        <span class="${task.status ? "active-task" : "unactive-task"}"></span>
        <input class="${task.status ? "task-name" : "task-name-line"}" value="${task.name}" disabled="true"/>
        <span class='task-remove'></span></div>`
    }
    tasksBox.innerHTML = content;
}
function renderControlPanel(controlPanel: HTMLElement, tasks: Task[]) {
    if (!tasks.length) {
        controlPanel.innerHTML = '';
        let classList = controlPanel.classList
        classList.add('hidden')
        classList.remove('visibility')
        return;
    }
    let activeTask = tasks.filter((task: Task): boolean=> {
        return task.status;
    })
    let countMsg = `${activeTask.length} item left`
    if (tasks.length && controlPanel.children.length) {
        let countField = <HTMLElement>controlPanel.querySelector('.count');
        countField.innerHTML = countMsg;
        return;
    }
    let content: string = '';
    content += `
       <span class="count">${countMsg}</span>
       <span class="get-all controll active-control">All</span>
       <span class="get-active controll">Active</span>
       <span class="get-completed controll">Comleted</span>`
    controlPanel.innerHTML = content;
    let classList = controlPanel.classList
        classList.add('visibility')
        classList.remove('hidden')
}

function addTask(tasksBox: HTMLElement, task: Task) {
    allTasks.push(task);
}