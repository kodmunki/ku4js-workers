$(function() {
    function notOk(s, m) {
        equal(s, false, m);
    }

    module("reciever Test");

    test("new", function () {
        expect(1);
        ok($.ku4WorkerReceiver());
    });

    test("execute null args", function () {
        expect(1);
        function callback(data) {
            equal(data, null);
        }
        $.ku4WorkerReceiver().execute(null, callback);
    });

    test("execute invalid args", function () {
        expect(1);
        function callback(data) {
            equal(data, null);
        }
        $.ku4WorkerReceiver().execute({}, callback);
    });

    test("execute empty args", function () {
        expect(1);
        function callback(data) {
            equal(data, null);
        }
        $.ku4WorkerReceiver().execute([], callback);
    });

    test("execute empty data", function () {
        expect(1);
        function callback(data) {
            equal(data, null);
        }
        $.ku4WorkerReceiver().execute({data:"[]"}, callback);
    });

    test("execute simple data", function () {
        var data = ["$.math", [], "round", [4.153, -2]];

        expect(1);
        function callback(data) {
            equal(data, 4.15);
        }
        $.ku4WorkerReceiver().execute({data: $.json.serialize(data)}, callback);
    });


    asyncTest("execute async data", function () {
        var data = [
            "$.service", [],
            [
                {"uri":["stubs/asyncResponse.stub.json"]},
                {"onSuccess":["__CALLBACK__"]},
                {"onError":["__CALLBACK__"]},
                "call"
            ], true];

        expect(1);
        function callback(message) {
            equal(message, "{response: true}");
            start();
        }
        $.ku4WorkerReceiver().execute({data: $.json.serialize(data)}, callback);
    });
});