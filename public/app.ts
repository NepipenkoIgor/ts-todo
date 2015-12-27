interface Array<T> {
    findIndex(callbackfn:(value:T, index:number, array:T[]) => boolean, thisArg?:any): number;
}

interface Task {
    id: number,
    name: string,
    status: boolean
}

@TodoComponent({
    elem: 'main'
})
class Todo {
    private allTasks:Task[] = [];
    private tasksBox:HTMLElement;
    private controlPanel:HTMLElement;
    private taskInput:HTMLInputElement;
    private sortMode:string;
    constructor() {
        this.tasksBox.addEventListener('click', this.processingTasksList.bind(this));
        this.controlPanel.addEventListener('click', this.processingControlPanel.bind(this));
        this.tasksBox.addEventListener('keypress', this.enableTaskEditing.bind(this));
        this.taskInput.addEventListener('keypress', this.taskToList.bind(this));
    }
    private addTask(task:Task):void {
        this.allTasks.push(task);
    }

    private renderTasks(tasks:Task[], sortMode?:string) {
        let content:string = '';
        let currentTasks:Task[] = tasks;
        if (sortMode === 'get-active') {
            currentTasks = this.allTasks.filter((task:Task):boolean=> {
                return task.status;
            })
        }
        if (sortMode === 'get-completed') {
            currentTasks = this.allTasks.filter((task:Task):boolean=> {
                return !task.status;
            })
        }
        for (let task of currentTasks) {
            content += `<div class="full-task" data-id='${task.id}'>
        <span class="${task.status ? "active-task" : "unactive-task"}"></span>
        <input class="${task.status ? "task-name" : "task-name-line"}" value="${task.name}" disabled="true"/>
        <span class='task-remove'></span></div>`
        }
        this.tasksBox.innerHTML = content;
    }

    private renderControlPanel(tasks:Task[]) {
        if (!tasks.length) {
            this.controlPanel.innerHTML = '';
            let classList = this.controlPanel.classList;
            classList.add('hidden');
            classList.remove('visibility');
            return;
        }
        let activeTask = tasks.filter((task:Task):boolean=> {
            return task.status;
        });
        let countMsg = `${activeTask.length} item left`;
        if (tasks.length && this.controlPanel.children.length) {
            let countField = <HTMLElement>this.controlPanel.querySelector('.count');
            countField.innerHTML = countMsg;
            return;
        }
        let content:string = '';
        content += `
       <span class="count">${countMsg}</span>
       <span class="get-all controll active-control">All</span>
       <span class="get-active controll">Active</span>
       <span class="get-completed controll">Comleted</span>`;
        this.controlPanel.innerHTML = content;
        let classList = this.controlPanel.classList;
        classList.add('visibility');
        classList.remove('hidden')
    }

    private taskToList(e) {
        if (e.keyCode === 13 && this.taskInput.value) {
            this.addTask({id:Date.now(),name: this.taskInput.value,status: true});
            this.taskInput.value = '';
            this.renderTasks(this.allTasks, this.sortMode);
            this.renderControlPanel(this.allTasks)
        }
    }

    private enableTaskEditing(e):void {
        if (e.keyCode !== 13) {
            return;
        }
        let target = <HTMLInputElement>e.target;
        let taskNode = <HTMLElement>target.parentNode;
        let dataset = <any>taskNode.dataset;
        let index =this.allTasks.findIndex((task:Task):boolean => {
            return task.id === parseInt(dataset.id, 10)
        });
        this.allTasks[index].name = target.value;
        target.setAttribute('disabled', 'true')
    }

    private processingControlPanel(e):void {
        let target = <HTMLElement>e.target;
        let curentClass = target.classList;
        let controls = this.controlPanel.children;
        if (curentClass[0] === 'count') {
            return;
        }
        Array.prototype.forEach.call(controls, (control) => {
            let classList = control.classList;
            classList.remove('active-control')
        });
        this.sortMode = null;
        if (curentClass[0] === 'get-active') {
            this.sortMode = 'get-active'
        }
        if (curentClass[0] === 'get-completed') {
            this.sortMode = 'get-completed'
        }
        this.renderTasks(this.allTasks, this.sortMode);
        curentClass.add('active-control')
    }

    private processingTasksList(e):void {
        let target = <HTMLElement>e.target;
        let taskNode = <HTMLElement>target.parentNode;
        let dataset = <any>taskNode.dataset;
        let className = target.classList[0];
        if (className === 'task-name' || className === 'task-name-line') {
            Array.prototype.forEach.call(this.tasksBox.children, (taskNode) => {
                let input = taskNode.querySelector('input');
                input.setAttribute('disabled', 'true')
            });
            target.removeAttribute('disabled');
            return;
        }
        let index = this.allTasks.findIndex((task:Task):boolean => {
            return task.id === parseInt(dataset.id, 10)
        });
        if (className === 'active-task' || className === 'unactive-task') {
            this.allTasks[index].status = !this.allTasks[index].status
        }
        if (className === 'task-remove') {
            this.allTasks.splice(index, 1)
        }
        this.renderTasks(this.allTasks, this.sortMode);
        this.renderControlPanel(this.allTasks)
    }

}

interface ITodoComponent {
    elem:string
}
function TodoComponent(opt:ITodoComponent) {
    return function (constructor) {
        let elem = <HTMLElement>document.querySelector(opt.elem);
        elem.innerHTML = `<div class="todo-widget">
            <input class="task-input" type="text">
            <div class="tasks-box"></div>
            <div class="control-panel"></div>
        </div>`;
        constructor.prototype.taskInput = elem.querySelector('.task-input');
        constructor.prototype.tasksBox = elem.querySelector('.tasks-box');
        constructor.prototype.controlPanel = elem.querySelector('.control-panel');
    }
}
window.onload = () => {
 new Todo();
};