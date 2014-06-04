function ku4WorkerReceiver() { }
ku4WorkerReceiver.prototype = {
    execute: function(event, callback){
        var data = ($.exists(event.data)) ? event.data : event,
            obj = $.dto.parseJson(data).toObject(),
            constructors = obj.constructors,
            method = obj.method,
            args = obj.arguments,
            isAsync = obj.isAsync,
            Class = obj.Class;

        if(!$.exists(Class))
            throw $.ku4exception("Argument Exception", "$.ku4WorkerReceiver can only execute json call containing valid Class and method.");

        if(isAsync && $.isArray(method)) ku4WorkerReceiver_executeAsyncChain(Class, constructors, method, callback);
        else if(isAsync) ku4WorkerReceiver_executeAsyncMethod(Class, constructors, method, args, callback);
        else if($.isString(method)) callback(ku4WorkerReceiver_executeMethod(Class, constructors, method, args));
        else if($.isObject(method)) callback(ku4WorkerReceiver_executeMethodObject(Class, constructors, method));
        else if($.isArray(method)) callback(ku4WorkerReceiver_executeChain(Class, constructors, method));
        else if(!$.exists(method)) callback(ku4WorkerReceiver_instantiate(Class, constructors));
        else return callback(null);
    }
};
$.ku4WorkerReceiver = function(){ return new ku4WorkerReceiver(); };

function ku4WorkerReceiver_executeMethod(Class, constructors, method, args)
{
    var instance = ku4WorkerReceiver_instantiate(Class, constructors);
    return ku4WorkerReceiver_execute(instance, method, args)
}

function ku4WorkerReceiver_executeAsyncMethod(Class, constructors, method, args, callback)
{
    var instance = ku4WorkerReceiver_instantiate(Class, constructors);
    return ku4WorkerReceiver_executeAsync(instance, method, args, callback)
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
                args[index] = function() {
                    callback($.list.parseArguments(arguments).toArray());
                };
                index = args.indexOf("__CALLBACK__");
            }
            instance = ku4WorkerReceiver_execute(instance, methodName, args);
        }
    });
}

function ku4WorkerReceiver_instantiate(Class, constructors) {
    var isNew = /^new\s.+$/.test($.str.trim(Class)),
        className = Class.replace(/^new\s/, ""),
        namespace = className.split("."),
        rootObject = namespace.shift(),
        _class = eval("(" + rootObject + ")");

    $.list(namespace).each(function (item) {  _class = _class[item];  });
    return _class.apply(this, constructors);
}

function ku4WorkerReceiver_execute(instance, method, args)
{
    return instance[method].apply(instance, args);
}

function ku4WorkerReceiver_executeAsync(instance, method, args, callback)
{
    var index = args.indexOf("__CALLBACK__");
    while(index !== -1) {
        args[index] = callback;
        index = args.indexOf("__CALLBACK__");
    }

    instance[method].apply(instance, args);
}