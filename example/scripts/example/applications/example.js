$.ku4WorkerClient.threadPath("scripts/example/lib/ku4js-workers-thread.js");

function calculate(iterations) {

    $.ku4WorkerClient.thread()
        .onSuccess(function(data){
            console.log(data);
        })
        .onError(function(data){
            console.log(data);
        })
        .invoke("$.calculator", [], "calculateNumberOfAnswers", [100000]);
}