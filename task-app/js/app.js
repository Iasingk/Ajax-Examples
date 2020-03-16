$(function(){

    fetchTasks();
    
    let formSearch = document.querySelector('#search'),
        containerTasks = document.querySelector('#container'),
        tasksResults = document.querySelector('#tasks-result'),
        taskForm = document.querySelector('#task-form'),
        tasksContent = document.querySelector('#tasks');

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
            description: document.querySelector('#description').value
         };
         $.post('task-add.php', postData, function(response){
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
                    <tr>
                    <td>${task.id}</td>
                    <td>${task.name}</td>
                    <td>${task.description}</td>
                    </tr>
                    `
                });
                tasksContent.innerHTML += template;
            }
        });
    }
});