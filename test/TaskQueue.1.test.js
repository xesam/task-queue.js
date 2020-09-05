const {TaskQueue, Task} = require('../index');

describe('simple', () => {
    it('test priority', () => {
        let seqs = [];
        const queue = new TaskQueue('tq1');
        queue.start();

        const task1 = new Task(next => {
            setTimeout(() => {
                assert.deepEqual([3, 2], seqs);
                seqs.push(1);
                const err = null;
                const data = {
                    msg: 'this is task1'
                };
                next(err, data);
            }, 1000);
        }, {tag: 'tag1'});

        const task2 = new Task(next => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    assert.deepEqual([3], seqs);
                    seqs.push(2);
                    const data = {
                        msg: 'this is task2'
                    };
                    resolve(data);
                }, 1000);
            });
        }, {priority: 2, tag: 'tag1'});

        const task3 = new Task(next => {
            setTimeout(() => {
                assert.deepEqual([], seqs);
                seqs.push(3);
                const err = null;
                const data = {
                    msg: 'this is task3'
                };
                next(err, data);
            }, 1000);
        }, {priority: 3, tag: 'tag2'});

        const task4 = new Task(next => {
            setTimeout(() => {
                assert.deepEqual([3, 2, 1], seqs);
                seqs.push(4);
                const err = null;
                const data = {
                    msg: 'this is task4'
                };
                next(err, data);
            }, 1000);
        });

        queue.add(task1);
        queue.add(task2);
        queue.add(task3);
        queue.add(task4);
    });
})