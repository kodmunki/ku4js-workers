$(function() {
    function notOk(s, m) {
        equal(s, false, m);
    }

    module("client Test");

    test("new", function () {
        expect(1);
        ok($.ku4workerClient("stubs/receiver.stub.js"));
    });

    asyncTest("call function", function () {
        expect(1);
        $.ku4workerClient("stubs/receiver.stub.js")
            .onSuccess(function(message) {
                var data = $.json.deserialize(message);
                equal(data, 4.15);
                start();
            })
            .invoke("$.math", [], "round", [4.153, -2]);
    });

    asyncTest("call single method no args success", function () {
        expect(1);
        $.ku4workerClient("stubs/receiver.stub.js")
            .onSuccess(function(message) {
                var data = $.json.deserialize(message);
                equal(data, "B145.67");
                start();
            })
            .invoke("$.money", [145.67, 'B'], "toString");
    });

    asyncTest("call single method no args success", function () {
        expect(3);
        $.ku4workerClient("stubs/receiver.stub.js")
            .onSuccess(function(data){
                equal(data.a, 1);
                equal(data.b, 2);
                equal(data.c, 3);
                start();
            })
            .invoke("$.dto", [{'a':1, 'b':2, 'c':3}], "toObject");
    });

    asyncTest("call single method object no args success", function () {
        expect(3);
        $.ku4workerClient("stubs/receiver.stub.js")
            .onSuccess(function(message){
                var data = $.dto.parseJson(message).toObject();
                equal(data.a, 1);
                equal(data.b, 2);
                equal(data.c, 3);
                start();
            })
            .invoke("$.dto", [{'a':1, 'b':2, 'c':3}], {"toObject": []});
    });

    asyncTest("call method chain success", function () {
        expect(5);
        $.ku4workerClient("stubs/receiver.stub.js")
            .onSuccess(function(message){
                var data = $.dto.parseJson(message).toObject();
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

    asyncTest("call async method chain success", function () {
        expect(1);
        $.ku4workerClient("stubs/receiver.stub.js")
            .onSuccess(function(message){
                equal(message, "{response: true}");
                start();
            })
            .invoke("$.service", [], [
                {"uri": ["./asyncResponse.stub.json"]},
                {"onSuccess": ["__CALLBACK__"]},
                {"onError": ["__CALLBACK__"]},
                "call"], true);
    });

    asyncTest("invoke async method chain with continued processing", function () {
        expect(2);
        $.ku4workerClient("stubs/receiver.stub.js")
            .onSuccess(function(err, store) {
                equal(err, null);

                store.read("persons", function(err, collection) {
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
                "^(err, collection){ collection.insert({id:1, name:'myName'}).save(function(){ __CALLBACK__; }) }"
            ]}, true);
    });

});