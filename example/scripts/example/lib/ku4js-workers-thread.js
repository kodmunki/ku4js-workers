/* This file assumes that it will be placed in the same directory
 * as the files that it depends on:
 *
 * - ku4js-kernel.js
 * - ku4js-data.js
 * - ku4js-workers.js
 *
 * In all ku4js-* instances this should be the bin directory of the scripts
 * project. If you are not using the standard ku4* method of scripting
 * you will need to modify this file accordingly.
 */

importScripts("ku4js-kernel.js");
importScripts("ku4js-data.js");
importScripts("ku4js-reflection.js");
importScripts("ku4js-workers.js");

/*== Add additional imports here ==*/

//importScripts("[PATH]");

/*=================================*/

onmessage = function(event) {
    $.ku4WorkerReceiver().execute(event, function() {
        var result = $.list.parseArguments(arguments).toArray();
        postMessage($.json.serialize(result));
    });
};