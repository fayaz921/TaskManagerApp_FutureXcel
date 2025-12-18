$(document).ready(function () {

    loadTasks();

    // CREATE TASK
    $('#saveTask').click(function () {

        let task = {
            title: $('#title').val(),
            description: $('#description').val(),
            status: parseInt($('#status').val()),
            dueDate: $('#dueDate').val() || null
        };

        // basic client-side validation
        if (task.title.trim() === '') {
            alert('Title is required');
            return;
        }

        $('#saveTask').prop('disabled', true);

        $.ajax({
            url: '/api/tasks',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(task),
            success: function () {
                clearForm();
                loadTasks();
            },
            error: function () {
                alert('Error creating task');
            },
            complete: function () {
                $('#saveTask').prop('disabled', false);
            }
        });
    });

});

// LOAD ALL TASKS
function loadTasks() {
    $.ajax({
        url: '/api/tasks',
        type: 'GET',
        success: function (tasks) {
            let rows = '';

            $.each(tasks, function (i, task) {
                rows += `
                    <tr>
                        <td>${task.title}</td>
                        <td>${getStatusText(task.status)}</td>
                        <td>${task.dueDate ? task.dueDate.split('T')[0] : ''}</td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });

            $('#taskTable').html(rows);
        },
        error: function () {
            alert('Error loading tasks');
        }
    });
}

// Helpers
function clearForm() {
    $('#taskId').val('');
    $('#title').val('');
    $('#description').val('');
    $('#status').val(0);
    $('#dueDate').val('');
}

function getStatusText(status) {
    switch (status) {
        case 0: return 'Pending';
        case 1: return 'In Progress';
        case 2: return 'Completed';
        default: return '';
    }
}
