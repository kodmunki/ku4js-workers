$(function() {
    function notOk(s, m) {
        equal(s, false, m);
    }

    module("worker Test");

    test("new", function () {
        expect(1);
        ok($.ku4WorkerClient("stubs/receiver.stub.js"));
    });

    asyncTest("call single method no args success", function () {
        expect(3);
        $.ku4WorkerClient("stubs/receiver.stub.js")
            .onSuccess(function(data){
                equal(data.a, 1);
                equal(data.b, 2);
                equal(data.c, 3);
                start();
            })
            .call("$.dto", [{'a':1, 'b':2, 'c':3}], "toObject");
    });

    asyncTest("call single method object no args success", function () {
        expect(3);
        $.ku4WorkerClient("stubs/receiver.stub.js")
            .onSuccess(function(data){
                equal(data.a, 1);
                equal(data.b, 2);
                equal(data.c, 3);
                start();
            })
            .call("$.dto", [{'a':1, 'b':2, 'c':3}], {"toObject": []});
    });

    asyncTest("call method chain success", function () {
        expect(5);
        $.ku4WorkerClient("stubs/receiver.stub.js")
            .onSuccess(function(data){
                ok(!data.a);
                equal(data.b, 2);
                equal(data.c, 3);
                equal(data.d, 100);
                equal(data.z, "test");
                start();
            })
            .call("$.dto", [{'a':1, 'b':2, 'c':3}], [
                {"add": ["d", 100]},
                {"add": ["z", "test"]},
                {"remove": ["a"]},
                "toObject"
            ]);
    });
});