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