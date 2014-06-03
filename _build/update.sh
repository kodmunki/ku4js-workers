sh build.sh

echo "Copying resources to dependent projects/"
cp -f ../bin/ku4js-workers.js ../../ku4js-workers/tests/_dependencies/
cp -f ../bin/ku4js-workers.js ../../ku4js-webApp/tests/_dependencies/
cp -f ../bin/ku4js-workers.js ../../ku4js-webApp/example/scripts/example/lib/
cp -f ../bin/ku4js-workers.js ../../ku4js-webApp/_TEMPLATE/lib/

cp -f ../docs/thread/ku4js-workers-thread.js ../bin/
cp -f ../docs/thread/ku4js-workers-thread.js ../../ku4js-workers/tests/_dependencies/

echo "Update complete :{)}"