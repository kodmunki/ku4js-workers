importScripts("../_dependencies/ku4js-kernel.js");
importScripts("../_dependencies/ku4js-data.js");
importScripts("../../bin/ku4js-workers.js");

onmessage = function(event) {
    $.ku4WorkerReceiver().execute(event, function(result) {
        var _result = ($.isArray(result) || $.isObject(result)) ? result : [result];
        postMessage($.dto(_result).toJson());
    });
};