function ku4workerClient(path) {
    if(!$.exists(Worker))
        throw $.ku4exception("Unsupported Feature", "Client does not support Workers.");

    var onInvoked = $.observer("ku4workerClient_onInvoked"),
        onSuccess = $.observer("ku4workerClient_onSuccess"),
        onCanceled = $.observer("ku4workerClient_onCanceled"),
        onError = $.observer("ku4workerClient_onError"),
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
ku4workerClient.prototype = {
    processId: function(){ return this._processId; },
    onInvoked: function(func, scope, id) {
        this._onInvoked.add(function() { func.call(scope, this._processId); }, this, id);
        return this;
    },
    onSuccess: function(func, scope, id) {
        this._onSuccess.add(function(message) {
            var args = $.json.deserialize(message);
            if(!$.isArray(args)) args = [args];
            args.push(this._processId);
            func.apply(scope, args);
        }, this, id);
        return this;
    },
    onCanceled: function(func, scope, id) {
        this._onCanceled.add(function() { func.call(scope, this._processId); }, this, id);
        return this;
    },
    onError: function(func, scope, id) {
        this._onError.add(function(message) {
            var args = $.json.deserialize(message);
            if(!$.isArray(args)) args = [args];
            args.push(this._processId);
            func.apply(scope, args);
        }, this, id);
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

$.ku4workerClient = function(path){ return new ku4workerClient(path); };

var __ku4workerThreadPath = "ku4js-workers-thread.js";
$.ku4workerClient.threadPath = function(path){ __ku4workerThreadPath = path; };
$.ku4workerClient.thread = function() {
    try {
        return new ku4workerClient(__ku4workerThreadPath);
    }
    catch(e)
    {
        throw $.ku4exception("Invalid path", $.str.format(
            "ku4 threading requires a browser that supports Workers and a valid path to the ku4js-workers-thread.js file." +
            "You can set that path with the $.ku4workerClient.threadPath([PATH]) method. Current path: {0}",
            __ku4workerThreadPath));
    }
};