"use strict";

class Tasks {
    
    constructor() {

        this.settings = {
            notificationElement: document.getElementById('notification'),
            notificationClass: {
                success: 'alert alert-success',
                error: 'alert alert-danger'
            },
            apiRoute: '/api/tasks',
            addForm: document.getElementById('add-task'),
            updateForm: document.getElementById('update-task')
        };

        this.loadTasks();
        this.handleCreateTask();
        this.handleUpdateTask();

        this.handleStornoLink();
    }

    loadTasks() {

        axios.get(this.settings.apiRoute).then((response) => {

            let $container = document.getElementById('todo-container');

            $container.innerHTML = '';

            if(Object.keys(response.data).length === 0) {
                $container.innerText = 'There are no tasks';
            }

            Object.keys(response.data).forEach((index) => {

                let item = response.data[index];

                this.createTaskItem($container, item);
            });

        }).catch((error) => {

            this.notify('error', 'Server error');
        });

    }

    handleCreateTask() {

        this.settings.addForm.addEventListener('submit', (e) => {

            e.preventDefault();

            let data = this.formData(e.target);

            axios.post(this.settings.apiRoute, {
                id: data.get('id'),
                text: data.get('text')
            }).then((response) => {

                if(response.status === 204) {

                    this.loadTasks();
                    this.notify('success', 'Task was sucessfully created');

                    e.target.reset();
                }

            }).catch((error) => {

                this.notify('error', error.response.data);
            });
        });

    }

    handleUpdateTask() {

        this.settings.updateForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let $el = e.target;
            let data = this.formData(e.target);

            axios.put(this.settings.apiRoute + '/' + $el.dataset.id, {
                id: data.get('id'),
                text: data.get('text')
            }).then((response) => {

                this.loadTasks();
                this.notify('success', 'Task was successfully updated');

                this.settings.addForm.setAttribute('class', '');
                this.settings.updateForm.setAttribute('class', 'hidden');

            }).catch((error) => {});
        });
    }

    handleCompleteTask(element){

        element.addEventListener('click', (e) => {

            e.preventDefault();
            e.stopPropagation();

            let $el = e.target;

            axios.delete(this.settings.apiRoute + '/' + $el.dataset.id).then((response) => {

                if(response.status === 204) {

                    this.loadTasks();
                    this.notify('success', 'Task #'+ $el.dataset.id +' was completed');
                }

            }).catch((error) => {

            });
        });

    }

    /**
     *
     * @param status [success / error]
     * @param message
     */
    notify(status, message) {

        let $el = this.settings.notificationElement,
            $message = document.createElement('div');

        $el.innerHTML = '';

        $message.setAttribute('class', this.settings.notificationClass[status]);
        $message.innerText = message;

        $el.appendChild($message);
    }

    formData(form) {

        return new FormData(form);
    }

    createTaskItem($container, data) {

        let $element = document.createElement('li');
        let $checkbox = document.createElement('input');
        let $row = document.createElement('div');
        let $col1 = document.createElement('div');
        let $col11 = document.createElement('div');

        $row.setAttribute('class', 'row');
        $col1.setAttribute('class', 'col-md-1');
        $col11.setAttribute('class', 'col-md-11');

        $col11.innerText = data.text;

        $element.setAttribute('class', 'list-group-item');
        $element.setAttribute('title', 'Click me to complete task');

        $checkbox.setAttribute('type', 'checkbox');
        $checkbox.setAttribute('data-id', data.id);

        // add checkbox to column
        $col1.appendChild($checkbox);

        // append grid columns to list item
        $row.appendChild($col1);
        $row.appendChild($col11);

        $element.appendChild($row);

        $container.appendChild($element);

        this.handleCompleteTask($checkbox);
        this.handleEditTask($element);
    }

    handleEditTask(element) {

        element.addEventListener('click', (e) => {

            let $el = e.target;

            this.settings.addForm.setAttribute('class', 'hidden');
            this.settings.updateForm.setAttribute('class', '');


            let $idField = this.settings.updateForm.getElementsByClassName('id-field')[0],
                $textField = this.settings.updateForm.getElementsByClassName('text-field')[0],
                id = $el.closest('li').getElementsByTagName('input')[0].dataset.id;

            $idField.value = id;
            $textField.value = $el.innerText;

            this.settings.updateForm.setAttribute('data-id', id);
        });

    }

    handleStornoLink() {

        let stornoLink = document.getElementsByClassName('storno-link')[0];

        stornoLink.addEventListener('click', (e) => {

            e.preventDefault();

            this.settings.addForm.setAttribute('class', '');
            this.settings.updateForm.setAttribute('class', 'hidden');
        });


    }
}

