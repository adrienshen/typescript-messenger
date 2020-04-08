# #!/bin/sh
echo 'ts compiler, then sse mock server'
yarn run build & nodemon sse-server/app.js