const TaskQueue = require('../src/TaskQueue');
const Task = require('../src/Task');
const TaskFilter = require('../src/TaskFilter');

const taskQ1 = new TaskQueue('tq1');

const task0 = new Task(function (cb) {
    setTimeout(() => {
        cb(null, {
            _id: this._id,
            priority: this.priority
        });
    }, 2000);
}, {priority: 0, tag: 'tag1'});

const task1 = new Task(function (cb) {
    setTimeout(() => {
        cb(null, {
            _id: this._id,
            priority: this.priority
        });
    }, 2000);
}, {priority: 1, tag: 'tag1'});

const task2 = new Task(function (cb) {
    setTimeout(() => {
        cb(null, {
            _id: this._id,
            priority: this.priority
        });
    }, 2000);
}, {priority: 2, tag: 'tag2'});

const task3 = new Task(function (cb) {
    setTimeout(() => {
        cb(null, {
            _id: this._id,
            priority: this.priority
        });
    }, 2000);
}, {priority: 0, tag: 'tag2'});


taskQ1.add(task0);
taskQ1.add(task1);
taskQ1.add(task2);
taskQ1.add(task3);
taskQ1.start();
task2.cancel();

taskQ1.add(function (cb) {
    setTimeout(() => {
        cb(null, {msg: 'this is fn task'});
    }, 2000);
});

setTimeout(() => {
    taskQ1.cancel(TaskFilter.createTagFilter('tag2'));
}, 4000);
