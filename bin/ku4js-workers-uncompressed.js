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
    call: function(Class, constructors, method, arguments, scope, isAsync) {
        this._worker.postMessage($.dto({
            Class: Class,
            constructors: constructors,
            method: method,
            arguments: arguments,
            scope: scope,
            isAsync: isAsync
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
    execute: function(event, callback){
        var data = ($.exists(event.data)) ? event.data : event,
            obj = $.dto.parseJson(data).toObject(),
            constructors = obj.constructors,
            method = obj.method,
            args = obj.arguments,
            scope = obj.scope,
            isAsync = obj.isAsync,
            Class = obj.Class;

        if(!(Class && method))
            throw $.ku4exception("Argument Exception", "$.ku4WorkerReceiver can only execute json call containing valid Class and method.");

        if(isAsync && $.isArray(method)) ku4WorkerReceiver_executeAsyncChain(Class, constructors, method, callback);
        else if(isAsync) ku4WorkerReceiver_executeAsyncMethod(Class, constructors, method, args, scope, callback);
        else if($.isString(method)) callback(ku4WorkerReceiver_executeMethod(Class, constructors, method, args, scope));
        else if($.isObject(method)) callback(ku4WorkerReceiver_executeMethodObject(Class, constructors, method));
        else if($.isArray(method)) callback(ku4WorkerReceiver_executeChain(Class, constructors, method));
        else return callback(null);
    }
};
$.ku4WorkerReceiver = function(){ return new ku4WorkerReceiver(); };

function ku4WorkerReceiver_executeMethod(Class, constructors, method, args, scope)
{
    var instance = ku4WorkerReceiver_instantiate(Class, constructors);
    return ku4WorkerReceiver_execute(instance, method, args, scope)
}

function ku4WorkerReceiver_executeAsyncMethod(Class, constructors, method, args, scope, callback)
{
    var instance = ku4WorkerReceiver_instantiate(Class, constructors);
    return ku4WorkerReceiver_executeAsync(instance, method, args, scope, callback)
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

function ku4WorkerReceiver_executeAsyncChain(Class, constructors, methods, callback)
{
    var instance = ku4WorkerReceiver_instantiate(Class, constructors);
    $.list(methods).each(function(method) {
        if($.isString(method)) instance = ku4WorkerReceiver_execute(instance, method);
        else {
            var methodName = $.obj.keys(method)[0],
                args = method[methodName],
                index = args.indexOf("__CALLBACK__");
            while(index !== -1) {
                args[index] = function() { callback(arguments); };
                index = args.indexOf("__CALLBACK__");
            }
            instance = ku4WorkerReceiver_execute(instance, methodName, args);
        }
    });
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

function ku4WorkerReceiver_executeAsync(instance, method, args, scope, callback)
{
    var index = args.indexOf("__CALLBACK__");
    while(index !== -1) {
        args[index] = callback;
        index = args.indexOf("__CALLBACK__");
    }

    instance[method].apply(scope || instance, args);
}

})();