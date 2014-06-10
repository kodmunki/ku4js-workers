importScripts("../_dependencies/ku4js-kernel.js");
importScripts("../_dependencies/ku4js-data.js");
importScripts("../_dependencies/ku4js-reflection.js");
importScripts("../_dependencies/ku4js-workers-uncompressed.js");

onmessage = function(event) {
    $.ku4workerReceiver().execute(event, function() {
        var result = $.list.parseArguments(arguments).toArray();
        postMessage($.json.serialize(result));
    });
};