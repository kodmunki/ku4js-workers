function ku4WorkerClient(path) {
    if(!$.exists(Worker))
        throw $.ku4exception("Unsupported Feature", "Client does not support Workers.");

    var onSuccess = $.observer(),
        onError = $.observer(),
        worker = new Worker(path);

    worker.onmessage = function(event) { onSuccess.notify(event.data); };
    worker.onerror = function(event) { onError.notify(event.data); };

    this._onSuccess = onSuccess;
    this._onError = onError;
    this._worker = worker;
}
ku4WorkerClient.prototype = {
    onSuccess: function(func, scope) {
        this._onSuccess.add(func, scope);
        return this;
    },
    onError: function(func, scope) {
        this._onError.add(func, scope);
        return this;
    },
    call: function(Class, constructors, method, arguments, scope) {
        this._worker.postMessage($.dto({
            Class: Class,
            constructors: constructors,
            method: method,
            arguments: arguments,
            scope: scope
        }).toJson());
        return this;
    }
};

$.ku4WorkerClient = function(path){ return new ku4WorkerClient(path); };

var __ku4workerThreadPath = "ku4js-workers-thread.js";
$.ku4WorkerClient.threadPath = function(path){ __ku4workerThreadPath = path; };
$.ku4WorkerClient.thread = function() {
    try {
        return new ku4WorkerClient(__ku4workerThreadPath);
    }
    catch(e)
    {
        throw $.ku4exception("Invalid path", "ku4 threading requires a browser that supports Workers and a valid path to the ku4js-workers-thread.js file. You can set that path with the $.ku4WorkerClient.threadPath([PATH]) method.")
    }
};