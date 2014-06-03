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

function ku4WorkerReceiver() { }
ku4WorkerReceiver.prototype = {
    execute: function(event){
        var data = ($.exists(event.data)) ? event.data : event,
            obj = $.dto.parseJson(data).toObject(),
            constructors = obj.constructors,
            method = obj.method,
            args = obj.arguments,
            scope = obj.scope,
            Class = obj.Class;

        if(!(Class && method))
            throw $.ku4exception("Argument Exception", "$.ku4WorkerReceiver can only execute json call containing valid Class and method.");

        if($.isString(method)) return ku4WorkerReceiver_executeMethod(Class, constructors, method, args, scope);
        if($.isObject(method)) return ku4WorkerReceiver_executeMethodObject(Class, constructors, method);
        if($.isArray(method)) return ku4WorkerReceiver_executeChain(Class, constructors, method);
        else return null;
    }
};
$.ku4WorkerReceiver = function(){ return new ku4WorkerReceiver(); };

function ku4WorkerReceiver_executeMethod(Class, constructors, method, args, scope)
{
    var instance = ku4WorkerReceiver_instantiate(Class, constructors);
    return ku4WorkerReceiver_execute(instance, method, args, scope)
}

function ku4WorkerReceiver_executeMethodObject(Class, constructors, method)
{
    var instance = ku4WorkerReceiver_instantiate(Class, constructors),
        methodName = $.obj.keys(method)[0];
    return ku4WorkerReceiver_execute(instance, methodName, method[methodName]);
}

function ku4WorkerReceiver_executeChain(Class, constructors, methods)
{
    var instance = ku4WorkerReceiver_instantiate(Class, constructors);
    $.list(methods).each(function(method) {

        if($.isString(method)) instance = ku4WorkerReceiver_execute(instance, method);
        else {
            var methodName = $.obj.keys(method)[0];
            instance = ku4WorkerReceiver_execute(instance, methodName, method[methodName]);
        }
    });
    return instance;
}

function ku4WorkerReceiver_instantiate(Class, constructors) {
    var namespace = Class.split("."),
        rootObject = namespace.shift(),
        _class = eval("(" + rootObject + ")");

    $.list(namespace).each(function (item) {  _class = _class[item];  });
    return _class.apply(this, constructors);
}

function ku4WorkerReceiver_execute(instance, method, args, scope)
{
    return instance[method].apply(scope || instance, args);
}

})();
