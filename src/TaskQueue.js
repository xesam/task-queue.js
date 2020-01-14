const Events = require('./Events');
const Task = require('./Task');

const Status = {
    STOPPED: 0,
    IDLE: 1,
    RUNNING: 2
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
    }

    _perform() {
        if (this.status !== Status.IDLE) {
            return;
        }
        const task = this._nextTask();
        if (task) {
            this.status = Status.RUNNING;
            const next = (err, data) => {
                this._onCompleted(task, err, data);
                if (!err) {
                    this._perform();
                }
            };
            task.onEvent(Events.START);
            const p = task.perform(next);
            if (p instanceof Promise) {
                p.then((data) => {
                    this._onCompleted(task, null, data);
                    this._perform();
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
        this.tasks = this.tasks.filter(task => {
            return !taskFilter(task);
        });
    }

    cancel(taskFilter) {
        const cancelTasks = this.tasks.filter(taskFilter);
        cancelTasks.forEach(task => {
            task.cancel();
        });
    }
}

module.exports = TaskQueue;