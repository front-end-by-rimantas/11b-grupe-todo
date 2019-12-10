class Todo {
    constructor ( target, data ) {
        this.DOM = document.querySelector(target);
        this.DOMstatus = null;
        this.DOMtodo = null;
        this.DOMinProgress = null;
        this.DOMreview = null;
        this.DOMdone = null;
        this.DOMlightbox = null;
        this.DOMform = null;
        this.DOMinput = null;

        this.lastIndex = data.lastTaskID;
        this.tasks = data.list;

        this.init( this.tasks );
    }

    init ( data ) {
        this.DOM.classList.add('todo-app');

        let HTML = `
            <aside>
                <div class="logo"></div>
                <div class="add-task">+</div>
                <nav>
                    <a href="#">A</a>
                    <a href="#">B</a>
                    <a href="#">C</a>
                    <a href="#">D</a>
                    <a href="#">E</a>
                </nav>
            </aside>
            <header>
                <div class="search">
                    <input type="text">
                </div>
                <div class="notifications show"></div>
                <div class="user">
                    <img src="#" alt="Name Surname image">
                    <div class="name">Hello Johnyvino</div>
                    <div class="fa fa-angle-down">+</div>
                </div>
            </header>
            <div class="status">
                <div class="stat">
                    <span class="title">Todo</span>
                    <span class="value">0</span>
                </div>
                <div class="stat">
                    <span class="title">In progress</span>
                    <span class="value">0</span>
                </div>
                <div class="stat">
                    <span class="title">Review</span>
                    <span class="value">0</span>
                </div>
                <div class="stat">
                    <span class="title">Done</span>
                    <span class="value">0</span>
                </div>
            </div>
            <div class="todo">
                ${this.renderLists( data )}
            </div>
            <div class="lightbox">
                <div class="background"></div>
                <form>
                    <h3>Task title</h3>
                    <input type="text" placeholder="Your task...">
                    <div class="actions">
                        <div class="btn btn-save">Save</div>
                        <div class="btn btn-cancel">Cancel</div>
                    </div>
                </form>
            </div>`;
        this.DOM.innerHTML = HTML;
        this.DOMstatus = this.DOM.querySelectorAll('.status .value');

        this.DOMtodo = this.DOM.querySelector('.list:nth-of-type(1)');
        this.DOMinProgress = this.DOM.querySelector('.list:nth-of-type(2)');
        this.DOMreview = this.DOM.querySelector('.list:nth-of-type(3)');
        this.DOMdone = this.DOM.querySelector('.list:nth-of-type(4)');

        this.DOMlightbox = this.DOM.querySelector('.lightbox');
        this.DOMform = this.DOMlightbox.querySelector('form');
        this.DOMinput = this.DOMform.querySelector('input');

        this.DOM.querySelector('.add-task').addEventListener('click', () => {
            this.DOMlightbox.classList.add('show');
        })

        this.DOMform.querySelector('.btn-save').addEventListener('click', () => {
            this.createNewTask();
            this.DOMlightbox.classList.remove('show');
            this.DOMinput.value = '';
        })

        this.DOMform.querySelector('.btn-cancel').addEventListener('click', () => {
            this.DOMlightbox.classList.remove('show');
        })

        this.updateStatus();
    }

    createNewTask () {
        const text = this.DOMinput.value;
        this.lastIndex++;
        const task = {
            taskID: this.lastIndex,
            title: text
        }
        this.tasks[0].tasks = [task, ...this.tasks[0].tasks];
        this.DOMtodo.insertAdjacentHTML('afterbegin', this.renderTask( task ));
        this.updateStatus();
    }

    renderLists ( data ) {
        let HTML = '';
        for ( let i=0; i<data.length; i++ ) {
            HTML += '<div class="list">';
                for ( let t=0; t<data[i].tasks.length; t++ ) {
                    HTML += this.renderTask( data[i].tasks[t] );
                }
            HTML += '</div>';
        }
        return HTML;
    }

    renderTask ( data ) {
        let HTML = `
        <div class="card">
            <span class="task-id">${data.taskID}</span>
            ${data.title}
        </div>`;
        return HTML;
    }

    updateStatus () {
        for ( let i=0; i<this.tasks.length; i++ ) {
            this.DOMstatus[i].textContent = this.tasks[i].tasks.length;
        }
    }
}

export default Todo;