@echo off

node -r ./node_modules/yuyi-core-env/config/run-ts.js ./node_modules/yuyi-core-env/scripts/commit.ts %1 %2
