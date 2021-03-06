$(function() {
    function notOk(s, m) {
        equal(s, false, m);
    }

    module("thread Test");

    $.ku4workerClient.threadPath("_dependencies/ku4js-workers-thread.js");

    test("new", function () {
        expect(1);
        ok($.ku4workerClient.thread());
    });

    asyncTest("invoke function", function () {
        expect(1);
        $.ku4workerClient.thread()
            .onSuccess(function(data) {
                equal(data, 4.15);
                start();
            })
            .invoke("$.math", [], "round", [4.153, -2]);
    });

    asyncTest("invoke single method no args success", function () {
        expect(3);
        $.ku4workerClient.thread()
            .onSuccess(function(data){
                equal(data.a, 1);
                equal(data.b, 2);
                equal(data.c, 3);
                start();
            })
            .invoke("$.dto", [{'a':1, 'b':2, 'c':3}], "toObject");
    });

    asyncTest("invoke single method object no args success", function () {
        expect(3);
        $.ku4workerClient.thread()
            .onSuccess(function(data){
                equal(data.a, 1);
                equal(data.b, 2);
                equal(data.c, 3);
                start();
            })
            .invoke("$.dto", [{'a':1, 'b':2, 'c':3}], {"toObject": []});
    });

    asyncTest("invoke method chain success", function () {
        expect(5);
        $.ku4workerClient.thread()
            .onSuccess(function(data){
                ok(!data.a);
                equal(data.b, 2);
                equal(data.c, 3);
                equal(data.d, 100);
                equal(data.z, "test");
                start();
            })
            .invoke("$.dto", [{'a':1, 'b':2, 'c':3}], [
                {"add": ["d", 100]},
                {"add": ["z", "test"]},
                {"remove": ["a"]},
                "toObject"
            ]);
    });

    asyncTest("invoke async method chain success", function () {
        expect(1);
        $.ku4workerClient.thread()
            .onSuccess(function(message){
                equal(message, "{response: true}");
                start();
            })
            .invoke("$.service", [], [
                {"uri": ["../stubs/asyncResponse.stub.json"]},
                {"onSuccess": ["__CALLBACK__"]},
                {"onError": ["__CALLBACK__"]},
                "call"], true);
    });

    asyncTest("invoke async method chain with continued processing", function () {
        expect(2);
        $.ku4workerClient.thread()
            .onSuccess(function(err, store) {
                equal(err, null);

                $.ku4indexedDbStore().read("persons", function(err, collection) {
                    equal(collection.find({id:1})[0].name, "myName");
                    collection.remove();
                    start();
                });
            })
            .onError(function(err, store){
                console.log(err, store);
                start();
            })
            .invoke("$.ku4indexedDbStore", [], {"read": ["persons",
                "``^(err, collection){ collection.insert({id:1, name:'myName'}).save(function(err){__CALLBACK__.call(err); }) }"
            ]}, true);
    });
});