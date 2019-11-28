class Task {
    constructor(job, {priority = 0, tag = ''} = {}) {
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
        this.onCanceled();
    }

    onStarted() {
        console.log(this._id, this.priority, new Date().toUTCString(), 'onStarted');
    }

    onCompleted(err, data) {
        console.log(this._id, this.priority, new Date().toUTCString(), 'onCompleted', data);
    }

    onCanceled() {
        console.log(this._id, this.priority, new Date().toUTCString(), 'onCanceled');
    }

    perform(cb) {
        return this.job(cb);
    }
}

module.exports = Task;