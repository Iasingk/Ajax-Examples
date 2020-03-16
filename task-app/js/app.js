$(function(){

    let edit =  false;
    fetchTasks();
    
    let formSearch = document.querySelector('#search'),
        containerTasks = document.querySelector('#container'),
        tasksResults = document.querySelector('#tasks-result'),
        taskForm = document.querySelector('#task-form');
        

        tasksResults.classList.add('d-none');

    formSearch.addEventListener('keyup', function(event){
        if(formSearch){
        let contentFormSearch = formSearch.value;
        $.ajax({
            url: 'task-search.php',
            type: 'POST',
            data: {search: contentFormSearch},
            success: function(response){
                let tasks = JSON.parse(response), template = '';
                [].forEach.call(tasks, function(task){
                    template += `<li>
                        ${task.name}
                    </li>` 
                });
                containerTasks.innerHTML += template;
                tasksResults.classList.remove('d-none')
            }
        });
        }
    });

    taskForm.addEventListener('submit', function(event){
        event.preventDefault();
        const postData = {
            name: document.querySelector('#name').value,
            description: document.querySelector('#description').value,
            id: document.querySelector('#taskId').value
         };
         let url = edit === false ? 'task-add.php': 'task-edit.php';
         $.post(url, postData, function(response){
             fetchTasks();
             taskForm.reset();
         });
    });

    function fetchTasks(){
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function(response){
                let allTasks = JSON.parse(response), template ='';
                [].forEach.call(allTasks, function(task){
                    template += `
                    <tr taskId='${task.id}'>
                    <td>${task.id}</td>
                    <td>
                        <a href="#" class="task-item">${task.name}</a>
                    </td>
                    <td>${task.description}</td>
                    <td>
                        <button class="task-delete btn btn-danger">
                            Delete
                        </button>
                    </td>
                    </tr>
                    `
                });
                $('#tasks').html(template);
            }
        });
    };

    $(document).on('click', '.task-delete', function(){
        if(confirm('Are you sure you wantto delte it ?')){
            let element = $(this)[0].parentElement.parentElement,
            id = $(element).attr('taskId');
            $.post('task-delete.php', {id}, function(response){
                console.log(response);
                fetchTasks();
            });
        }
    });

    $(document).on('click', '.task-item', function(){
        let element = $(this)[0].parentElement.parentElement,
        id =  $(element).attr('taskId');
        $.post('task-single.php', {id}, function(response){
            const task = JSON.parse(response);
            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskId').val(task.id);
            edit = true;
        });
    });
});