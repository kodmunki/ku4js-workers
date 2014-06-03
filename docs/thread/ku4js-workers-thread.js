/* This files assumes that it will be placed in the same directory
 * as the files that it depends on:
 *
 * - ku4js-kernel.js
 * - ku4js-data.js
 * - ku4js-workers.js
 *
 * In all instances this should be the bin directory of the scripts
 * project. If you are not using the standard ku4* method of scripting
 * you will need to modify this file accordingly.
 */

importScripts("ku4js-kernel.js");
importScripts("ku4js-data.js");
importScripts("ku4js-workers.js");

onmessage = function(event) {
    postMessage($.ku4WorkerReceiver().execute(event));
};