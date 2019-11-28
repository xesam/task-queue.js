const Task = require('./Task');

class TaskQueue {

    constructor(name) {
        this.name = name;
        this.seqCount = 0;
        this.tasks = [];
        this.started = false;
        this.running = false;
    }

    _nextTask() {
        let task = this.tasks.shift();
        while (task && task.canceled) {
            task = this.tasks.shift();
        }
        return task;
    }

    _onCompleted(task, err, data) {
        this.running = false;
        if (!task.canceled) {
            task.onCompleted(err, data);
        }
    }

    _perform() {
        if (!this.started || this.running) {
            return;
        }
        const task = this._nextTask();
        if (task) {
            this.running = true;
            const cb = (err, data) => {
                this._onCompleted(task, err, data);
                if (!err) {
                    this._perform();
                }
            };
            task.onStarted();
            const p = task.perform(cb);
            if (p instanceof Promise) {
                p.then((data) => {
                    this._onCompleted(task, null, data);
                    this._perform();
                }).catch(err => {
                    this._onCompleted(task, err);
                });
            }
        }
    }

    getSeqId() {
        const id = `${this.name}-${this.seqCount}`;
        this.seqCount++;
        return id;
    }

    start() {
        this.started = true;
        this._perform();
    }

    stop() {
        this.started = false;
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
        this.tasks = this.tasks.filter(function () {
            return !taskFilter(...arguments);
        });
    }

    cancel(taskFilter) {
        const cancelTasks = this.tasks.filter(taskFilter);
        this.remove(taskFilter);
        cancelTasks.forEach(ele => {
            ele.cancel();
        });
    }
}

module.exports = TaskQueue;