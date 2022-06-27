const taskInput = document.querySelector('.task-input input'),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".btn-clear"),
    taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;
//getting Localstorage todo-list
let todos = JSON.parse(localStorage.getItem('todo-list'));

// console.log(todos , isEditedTask)
filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id)
    })
});

function showTodo(filter) {
    let li = '';
    if (todos) {
        todos.forEach((todo, id) => {
            //if todo status is complete ,set the isComplete value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == 'all') {
                li += ` <li class="task">
                        <label for="${id}">
                            <input onClick = "updateStatus(this)" type="checkbox" id="${id}" ${isCompleted} />
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="setting">
                            <i onClick = "showMenu(this) " class="fas fa-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onClick = "editTask(${id},'${todo.name}')"><i class="fas fa-pen"></i>Edit</li>
                                <li onClick = "deleteTask(${id})"><i class="fas fa-trash"></i>Delete</li>
                            </ul>
                        </div>  
                    </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
showTodo('all');







function showMenu(selectedTask) {
    //getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild
    taskMenu.classList.add('show');
    document.addEventListener("click", e => {
        //removing show class from the task menu on the document click
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove('show');
        }
    });
}



// console.log(taskId,taskName)
function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}




function deleteTask(deletedId) {
    // removing selected task from array/todos
    todos.splice(deletedId, 1);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo("all")
}

clearAll.addEventListener('click', () => {
    // removing all itemsk of array/todos
    todos.splice(0, todos.length);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo("all")
})








function updateStatus(selectedTask) {
    //getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add('checked');
        //updating status of selected task to complete
        todos[selectedTask.id].status = "completed";
    }
    else {
        taskName.classList.remove('checked')
        //updating status of selected task to pending
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem('todo-list', JSON.stringify(todos));
}






taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == 'Enter' && userTask) {
        if (!isEditedTask) { //if isEditedtask isn't true
            if (!todos) { //if todos is'nt exist , pass an empty array to todos
                todos = [];
            }

            let taskInfo = { name: userTask, status: 'pending' };
            todos.push(taskInfo);//adding new task for todos
        }
        else {
            // isEditedTask = false;
            todos[editId].name = userTask;
        }


        taskInput.value = '';
        localStorage.setItem('todo-list', JSON.stringify(todos));
        showTodo("all");
    }
});