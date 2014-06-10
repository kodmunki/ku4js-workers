$.ku4workerClient.threadPath("scripts/example/lib/ku4js-workers-thread.js");

var thread;
function calculate(iterations) {

    thread = $.ku4workerClient.thread()
        .onInvoked(function(data) {
            console.log(data);
        })
        .onSuccess(function(data, processId) {
            console.log(data, " | ", processId);
        })
        .onCanceled(function(data) {
            console.log("Canceled:", data);
        })
        .onError(function(data, processId) {
            console.log(data, " | ", processId);
        })
        .invoke("$.calculator", [], "calculateNumberOfAnswers", [iterations]);
}