const Events = require('./Events');

const DEFAULT_PRIORITY = -1;
const DEFAULT_TAG = Symbol('');

class Task {
    constructor(job, {priority = DEFAULT_PRIORITY, tag = DEFAULT_TAG} = {}) {
        this._id = -1;
        this.priority = priority;
        this.tag = tag;
        this.canceled = false;
        this.job = job.bind(this);
    }

    addToQueue(queue) {
        this.queue = queue;
        this._id = queue.getSeqId();
    }

    cancel() {
        this.canceled = true;
        if (this.queue) {
            this.queue.remove((ele) => {
                return ele._id === this._id;
            });
        }
        this.onEvent(Events.CANCEL);
    }

    perform(done) {
        return this.job(done);
    }

    onEvent(event, data) {
        console.log(`_id=${this._id},priority=${this.priority},event=${event}, data=${JSON.stringify(data)}`);
    }
}

module.exports = Task;