"use strict";

class Tasks {
    
    constructor() {

        this.settings = {
            notificationElement: document.getElementById('notification'),
            notificationClass: {
                success: 'alert alert-success',
                error: 'alert alert-danger'
            },
            apiRoute: '/api/tasks'
        };

        this.loadTasks();
        this.handleCreateTask();
    }

    loadTasks() {

        axios.get(this.settings.apiRoute).then((response) => {

            let $container = document.getElementById('todo-container');

            $container.innerHTML = '';

            Object.keys(response.data).forEach((index) => {

                let item = response.data[index];
                let $element = document.createElement('li');

                $element.innerText = item.text;
                $element.setAttribute('data-id', item.id);
                $element.setAttribute('class', 'complete-task');
                $element.setAttribute('title', 'Click me to complete task');

                $container.appendChild($element);

                this.handleCompleteTask($element);
            });

        }).catch(function(error){

            console.log(error);
        });

    }

    handleCreateTask() {

        document.getElementById('add-task').addEventListener('submit', (e) => {

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

    handleUpdateTask() {}

    handleCompleteTask(element){

        element.addEventListener('click', (e) => {

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
}

