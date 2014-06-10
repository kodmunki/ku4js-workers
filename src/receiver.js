function ku4workerReceiver() { }
ku4workerReceiver.prototype = {
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
$.ku4workerReceiver = function(){ return new ku4workerReceiver(); };