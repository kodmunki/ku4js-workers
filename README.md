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


##ku4WorkerClient
| API | Return | Description |
| --- | --- | --- |
| processId() |  |  |
| onInvoked() |  |  |
| onSuccess() |  |  |
| onCanceled() |  |  |
| onError() |  |  |
| invoke() |  |  |
| cancel() |  |  |

###ku4WorkerClient Examples:

####$.ku4WorkerClient.thread()

####$.ku4WorkerClient(PATH)

##ku4WorkerReceiver
| API | Return | Description |
| --- | --- | --- |
| execute |  |  |

###ku4WorkerReceiver Notes: