const createTagFilter = (targetTag) => {
    return (task) => {
        return task.tag === targetTag;
    };
};

module.exports = {
    createTagFilter
};