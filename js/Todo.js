class Todo {
    constructor ( target, data ) {
        this.data = data;
        this.DOM = document.querySelector(target);
        this.DOMasideCharts = null;
        this.DOMstatus = null;
        this.DOMtodo = null;
        this.DOMinProgress = null;
        this.DOMreview = null;
        this.DOMdone = null;
        this.DOMlightbox = null;
        this.DOMform = null;
        this.DOMinput = null;

        this.lastIndex = this.setIndex(data);
        this.tasks = this.setInitialList(data);

        this.init( this.tasks );
    }

    setIndex ( data ) {
        // is isores gauti duomenys
        if ( data ) {
            if ( data.lastTaskID ) {
                return data.lastTaskID;
            }
        }
        // localStorage esantys duomenys
        if ( localStorage.getItem('11b-todo-task-lastTaskID') ) {
            return JSON.parse( localStorage.getItem('11b-todo-task-lastTaskID') )
        }
        // jei nieko neturim, tai default
        return 0;
    }

    setInitialList ( data ) {
        // is isores gauti duomenys
        if ( data ) {
            if ( data.list ) {
                return data.list;
            }
        }

        // localStorage esantys duomenys
        if ( localStorage.getItem('11b-todo-task-list') ) {
            return JSON.parse( localStorage.getItem('11b-todo-task-list') )
        }

        // jei nieko neturim, tai default
        return [
            {
                listName: 'Todo',
                tasks: []
            },
            {
                listName: 'In progress',
                tasks: []
            },
            {
                listName: 'Review',
                tasks: []
            },
            {
                listName: 'Done',
                tasks: []
            }
        ];
    }

    init () {
        this.DOM.classList.add('todo-app');

        let HTML = `
            <aside>
                <div class="logo"></div>
                <div class="add-task">+</div>
                <nav>
                    <div id="aside_charts">Charts</div>
                    <div>B</div>
                    <div>C</div>
                    <div>D</div>
                    <div>E</div>
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
                ${this.renderLists( this.data )}
            </div>
            <div class="lightbox">
                <div class="background"></div>
                <div class="content"></div>
            </div>`;
        this.DOM.innerHTML = HTML;
        
        this.DOMasideCharts = this.DOM.querySelector('#aside_charts');
        this.DOMstatus = this.DOM.querySelectorAll('.status .value');

        this.DOMtodo = this.DOM.querySelector('.list:nth-of-type(1)');
        this.DOMinProgress = this.DOM.querySelector('.list:nth-of-type(2)');
        this.DOMreview = this.DOM.querySelector('.list:nth-of-type(3)');
        this.DOMdone = this.DOM.querySelector('.list:nth-of-type(4)');

        this.DOMlightbox = this.DOM.querySelector('.lightbox');
        this.DOMlightboxContent = this.DOMlightbox.querySelector('.content');

        this.DOMasideCharts.addEventListener('click', () => {
            this.DOMlightbox.classList.add('show');
            this.renderChart();
        })

        this.DOM.querySelector('.add-task').addEventListener('click', () => {
            this.DOMlightbox.classList.add('show');
            this.renderNewTaskForm();
        })

        this.DOMlightbox.querySelector('.background').addEventListener('click', () => {
            this.DOMlightbox.classList.remove('show');
        })

        window.addEventListener('keydown', (e) => {
            if ( e.keyCode === 27 ) {
                this.DOMlightbox.classList.remove('show');
            }
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
        console.log(task);
        
        this.tasks[0].tasks = [task, ...this.tasks[0].tasks];

        localStorage.setItem('11b-todo-task-lastTaskID', this.lastIndex)
        localStorage.setItem('11b-todo-task-list', JSON.stringify(this.tasks));
        
        this.DOMtodo.insertAdjacentHTML('afterbegin', this.renderTask( task ));
        this.updateStatus();
    }

    renderNewTaskForm () {
        const HTML = `
        <form>
            <h3>Task title</h3>
            <input type="text" placeholder="Your task...">
            <div class="actions">
                <div class="btn btn-save">Save</div>
                <div class="btn btn-cancel">Cancel</div>
            </div>
        </form>`;
        
        this.DOMlightboxContent.innerHTML = HTML;
        this.DOMform = this.DOMlightbox.querySelector('form');
        this.DOMinput = this.DOMform.querySelector('input');

        this.DOMform.querySelector('.btn-save').addEventListener('click', () => {
            this.createNewTask();
            this.DOMlightbox.classList.remove('show');
            this.DOMinput.value = '';
        })

        this.DOMform.querySelector('.btn-cancel').addEventListener('click', () => {
            this.DOMlightbox.classList.remove('show');
        })
    }

    renderChart () {
        const HTML = `
        <div id="chart_container">
            CHART
        </div>`;
        
        this.DOMlightboxContent.innerHTML = HTML;

        Highcharts.chart('chart_container', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Task completion'
            },
            // tooltip: {
            //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            // },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        // format: '<b>{point.name}</b>: {point.percentage:.0f} %'
                        format: '<b>{point.name}</b>: {point.y:.0f}'
                    }
                }
            },
            series: [{
                name: 'Categories',
                colorByPoint: true,
                data: [{
                    name: 'Todo',
                    y: this.tasks[0].tasks.length,
                    sliced: true,
                    selected: true
                }, {
                    name: 'In progress',
                    y: this.tasks[1].tasks.length
                }, {
                    name: 'Review',
                    y: this.tasks[2].tasks.length
                }, {
                    name: 'Done',
                    y: this.tasks[3].tasks.length
                }]
            }],
            credits: {
                enabled: false
            }
        });
    }

    renderLists () {
        let HTML = '';
        for ( let i=0; i<this.tasks.length; i++ ) {
            HTML += '<div class="list">';
                for ( let t=0; t<this.tasks[i].tasks.length; t++ ) {
                    HTML += this.renderTask( this.tasks[i].tasks[t] );
                }
            HTML += '</div>';
        }
        return HTML;
    }

    renderTask ( data ) {
        let HTML = `
        <div class="card">
            <span class="task-id">${data.taskID}</span>
            <span class="remove">x</span>
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