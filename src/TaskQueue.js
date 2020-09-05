const Events = require('./Events');
const Task = require('./Task');

const Status = {
    STOPPED: 'stopped',
    IDLE: 'idle',
    RUNNING: 'running'
};

class TaskQueue {

    constructor(name) {
        this.name = name;
        this.seqCount = 0;
        this.tasks = [];
        this.status = Status.STOPPED;
    }

    _nextTask() {
        let task = this.tasks.shift();
        while (task && task.canceled) {
            task = this.tasks.shift();
        }
        return task;
    }

    _onCompleted(task, err, data) {
        this.status = Status.IDLE;
        if (!task.canceled) {
            task.onEvent(Events.COMPLETE, {err, data});
        }
        if (!err) {
            this._perform();
        }
    }

    _perform() {
        if (this.status !== Status.IDLE) {
            return;
        }
        const task = this._nextTask();
        if (task) {
            this.status = Status.RUNNING;
            const done = (err, data) => {
                this._onCompleted(task, err, data);
            };
            task.onEvent(Events.START);
            const p = task.perform(done);
            if (p instanceof Promise) {
                p.then(data => {
                    this._onCompleted(task, null, data);
                }).catch(err => {
                    this._onCompleted(task, err);
                });
            }
        } else {
            this.status = Status.IDLE;
        }
    }

    getSeqId() {
        const id = `${this.name}-${this.seqCount}`;
        this.seqCount++;
        return id;
    }

    start() {
        this.status = Status.IDLE;
        this._perform();
    }

    stop() {
        this.status = Status.STOPPED;
    }

    add(task) {
        if (!(task instanceof Task)) {
            task = new Task(task);
        }
        this.tasks.push(task);
        this.tasks.sort((a, b) => {
            return a.priority >= b.priority ? -1 : 1;
        });
        task.addToQueue(this);
        this._perform();
    }

    remove(taskFilter) {
        this.tasks = this.tasks.filter(task => !taskFilter(task));
        return this;
    }

    cancel(taskFilter) {
        this.tasks.filter(taskFilter).forEach(task => {
            task.cancel();
        });
        return this;
    }
}

module.exports = TaskQueue;