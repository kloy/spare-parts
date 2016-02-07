export class Starter {
    constructor() {
        this._tasks = [];
    }

    task(message, fn) {
        this._tasks.push({
            message: message,
            async: false,
            task: fn,
        });

        return this;
    }

    asyncTask(message, fn) {
        this._tasks.push({
            message: message,
            async: true,
            task: fn,
        });

        return this;
    }

    start(startDone) {
        const tasks = this._tasks;

        function runTask(taskConfig) {
            if (!taskConfig) {
                startDone();
                return;
            }

            if (taskConfig.async) {
                taskConfig.task(function done(error) {
                    if (error) {
                        startDone(error, taskConfig.message);
                    } else {
                        runTask(tasks.shift());
                    }
                });
            } else {
                try {
                    taskConfig.task();
                    runTask(tasks.shift());
                } catch (error) {
                    startDone(error, taskConfig.message);
                }
            }
        }

        runTask(tasks.shift());
    }
}

const starter = new Starter();

export default starter;
