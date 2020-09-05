const {TaskQueue, Task} = require('../index');

describe('simple', () => {
    it('test priority', () => {
        const taskQ1 = new TaskQueue('tq1');
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

        taskQ1.add(task1);

        taskQ1.add(next => {
            setTimeout(() => {
                assert.deepEqual([3, 2, 1, 4], seqs);
                seqs.push(5);
                const err = null;
                const data = {
                    msg: 'this is task5'
                };
                next(err, data);
            }, 1000);
        });

        taskQ1.start();
    })
})

