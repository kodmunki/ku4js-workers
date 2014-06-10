#ku4js-workers

kodmunki™ utilities for JavaScript Web Workers.

*(The following are the instructions from the build script found in the template at /_build/build.sh)*

####kodmunki™ build process
---

This build process is dependent upon yuicompressor and a specific directory structure:

* root  
 * _build (This build script and the yuicompressor)
 * bin (The compiled scripts will appear here)
 * src (All script files go here)

The following variables found in setup () are
expected to be changed by the developer running
this process:

* PROJNAME (The name of your project)
* STARTMSG (A message to echo at start of build)
* ENDMSG (A message to echo at end of build)

#Documentation

##ku4workerClient
| API | Return | Description |
| --- | --- | --- |
| processId() | String | Returns a ku4 uid 32 byte unique string ID. |
| onInvoked(func:_Function_[, scope:_Object_]) | this | Subscribes func to be called in scope when the worker client is invoked. |
| onSuccess(func:_Function_[, scope:_Object_]) | this | Subscribes func to be called in scope when the worker client has completed successfully. |
| onCanceled(func:_Function_[, scope:_Object_]) | this | Subscribes func to be called in scope when the worker client process has been canceled. |
| onError(func:_Function_[, scope:_Object_]) | this | Subscribes func to be called in scope when the worker client is invoked |
| invoke(Class:_String_, constructors:_Array_[, method(s):_String_/_Array[, args:_Array_[, isAsync:_Boolean_]]]) | this | Invokes an instance of the specified class and supported method(s) sync or async _(More on this method and supported overloads below in the examples)_ |
| cancel() | this | Cancels the currently running process |
| thread() | ku4workerClient | Static class method that instantiates a new ku4workerClient using the receiver path specified by threadPath(). |
| threadPath(path:_String_) | this | Specifies the path to the receiver file that will be used when thread() is called. |

###ku4workerClient Examples:
There are numerous ways to leverage the ku4workerClient in a project architecture. A few of the most common are
described here:

####$.ku4workerClient.thread()
The ku4workerClient.thread method will spawn new ku4workerClient threads using the ku4js-workers-thread.js file or another
receiver file specified using the ku4workerClient threadPath method. Note that the threadPath method sets one global path.
This is often fine as many projects will have one receiver file that contain all necessary assets for any thread spawning
_(See comments in the ku4js-workers-thread.js file)_. By default this path is set to the ku4js-workers-thread.js file that
should be in the same directory as the ku4js-workers.js file. This is the same as the following set up:

```javascript
$.ku4workerClient.threadPath("ku4js-thread-path.js");
var threadUsingThreadPath = $.ku4workerClient.thread();
```

####$.ku4workerClient(PATH)
For those projects that require multiple ku4workerReceivers you can create the ku4workerClients by instatiating new
instances using the constructor method and passing the receiver path to the constructor. This means of creating a
ku4workerClient allows the developer to create various types of potential threads that, when spawned, may contain
different assets. Example:

```javascript
var thread1 = $.ku4workerClient("myReceiverPath"),
    thread2 = $.ku4workerClient("myOtherReceiverPath");

thread1.invoke("new myClass", [], "myMethod");
thread2.invoke("new otherClass", ["myConstructors"], [
    {"fluentMethod1": ["args"]},
    {"fluentMethod2": ["arg1", "arg2"]},
    "toString"
]);
```

##ku4workerReceiver
| API | Return | Description |
| --- | --- | --- |
| execute | void | This method is called by the ku4js-workers-thread file and needed be called otherwise. |

###ku4workerReceiver Notes:
Each ku4worker set up requires a ku4workerReceiver. These receivers are called from within the ku4js-workers-thread.js
file. It is expected that any and all threads will leverage _the_ or a modified copy of _the_ ku4js-workers-thread.js
file. More information on this file can be found in the comments within the file itself and in the example project
found in the /example directory.