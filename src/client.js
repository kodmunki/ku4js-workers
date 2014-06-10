function ku4WorkerClient(path) {
    if(!$.exists(Worker))
        throw $.ku4exception("Unsupported Feature", "Client does not support Workers.");

    var onInvoked = $.observer(),
        onSuccess = $.observer(),
        onCanceled = $.observer(),
        onError = $.observer(),
        worker = new Worker(path);

    worker.onmessage = function(event) { onSuccess.notify(event.data); };
    worker.onerror = function(event) { onError.notify(event.data); };

    this._processId = $.uid();
    this._onInvoked = onInvoked;
    this._onSuccess = onSuccess;
    this._onCanceled = onCanceled;
    this._onError = onError;
    this._worker = worker;
}
ku4WorkerClient.prototype = {
    processId: function(){ return this._processId; },
    onInvoked: function(func, scope) {
        this._onInvoked.add(function() { func.call(scope, this._processId); }, this);
        return this;
    },
    onSuccess: function(func, scope) {
        this._onSuccess.add(function(message) {
            var args = $.json.deserialize(message);
            if(!$.isArray(args)) args = [args];
            args.push(this._processId);
            func.apply(scope, args);
        }, this);
        return this;
    },
    onCanceled: function(func, scope) {
        this._onCanceled.add(function() { func.call(scope, this._processId); }, this);
        return this;
    },
    onError: function(func, scope) {
        this._onError.add(function(message) {
            var args = $.json.deserialize(message);
            if(!$.isArray(args)) args = [args];
            args.push(this._processId);
            func.apply(scope, args);
        }, this);
        return this;
    },
    invoke: function(Class, constructors, method, args, isAsync) {
        var message = $.json.serialize([Class, constructors, method, args, isAsync]);
        this._worker.postMessage(message);
        this._onInvoked.notify(this._processId);
        return this;
    },
    cancel: function() {
        this._worker.terminate();
        this._onCanceled.notify(this._processId);
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