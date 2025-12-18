$(document).ready(function () {

    loadTasks();

    // CREATE TASK
    $('#saveTask').click(function () {
        let task = {
            title: $('#title').val(),
            description: $('#description').val(),
            status: $('#status').val(),
            dueDate: $('#dueDate').val() || null
        };

        if (task.title.trim() === '') {
            showToast('Title is required', 'danger');
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
                showToast('Task created successfully!');
            },
            error: function () {
                showToast('Error creating task', 'danger');
            },
            complete: function () {
                $('#saveTask').prop('disabled', false);
            }
        });
    });

    // CANCEL EDIT
    $('#cancelEdit').click(function () {
        clearForm();
        $('#updateTask').remove();
        $('#saveTask').removeClass('d-none');
        $('#cancelEdit').addClass('d-none');
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
                    <tr class="table-row" style="opacity:0;">
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
            // Animate rows
            $('.table-row').each(function (i) {
                $(this).delay(50 * i).animate({ opacity: 1 }, 300);
            });
        },
        error: function () {
            showToast('Error loading tasks', 'danger');
        }
    });
}

// EDIT TASK
function editTask(id) {
    $.ajax({
        url: '/api/tasks/' + id,
        type: 'GET',
        success: function (task) {
            $('#taskId').val(task.id);
            $('#title').val(task.title);
            $('#description').val(task.description);
            $('#status').val(task.status);
            $('#dueDate').val(task.dueDate ? task.dueDate.split('T')[0] : '');

            $('#saveTask').addClass('d-none');
            $('#cancelEdit').removeClass('d-none');
            $('#updateTask').remove();

            $('.card-body').append('<button class="btn btn-success" id="updateTask">Update Task</button>');

            $('#updateTask').click(function () {
                let updatedTask = {
                    id: $('#taskId').val(),
                    title: $('#title').val(),
                    description: $('#description').val(),
                    status: $('#status').val(),
                    dueDate: $('#dueDate').val() || null
                };

                if (updatedTask.title.trim() === '') {
                    showToast('Title is required', 'danger');
                    return;
                }

                $.ajax({
                    url: '/api/tasks/' + updatedTask.id,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(updatedTask),
                    success: function () {
                        clearForm();
                        loadTasks();
                        $('#updateTask').remove();
                        $('#saveTask').removeClass('d-none');
                        $('#cancelEdit').addClass('d-none');
                        showToast('Task updated successfully!');
                    },
                    error: function () {
                        showToast('Error updating task', 'danger');
                    }
                });
            });
        },
        error: function () {
            showToast('Error fetching task', 'danger');
        }
    });
}

// DELETE TASK
function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    $.ajax({
        url: '/api/tasks/' + id,
        type: 'DELETE',
        success: function () {
            loadTasks();
            showToast('Task deleted successfully!', 'warning');
        },
        error: function () {
            showToast('Error deleting task', 'danger');
        }
    });
}

// Helpers
function clearForm() {
    $('#taskId').val('');
    $('#title').val('');
    $('#description').val('');
    $('#status').val('Pending');
    $('#dueDate').val('');
}
