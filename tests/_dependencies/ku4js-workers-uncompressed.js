(function(l){
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
        this._onSuccess.add(function(message) { func.apply(scope, $.json.deserialize(message)); });
        return this;
    },
    onError: function(func, scope) {
        this._onError.add(function(message) { func.apply(scope, $.json.deserialize(message)); });
        return this;
    },
    invoke: function(Class, constructors, method, args, isAsync) {
        var message = $.json.serialize([Class, constructors, method, args, isAsync]);
        this._worker.postMessage(message);
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

function ku4WorkerReceiver() { }
ku4WorkerReceiver.prototype = {
    execute: function(event, callback){
        var data = ($.exists(event) && $.exists(event.data)) ? event.data : event,
            args = $.json.deserialize(data);

        if(!$.isArray(args) || args.length < 1) return callback(null);

        var isAsync = ($.isBool(args[args.length - 1])) ? args.pop() : false;
        if(isAsync) {
            args.push(callback);
            $.ku4reflection.invoke(args)
        }
        else return callback($.ku4reflection.invoke(args));
    }
};
$.ku4WorkerReceiver = function(){ return new ku4WorkerReceiver(); };

})();
