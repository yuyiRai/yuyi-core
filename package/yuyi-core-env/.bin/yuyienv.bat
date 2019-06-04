@echo off

node -r %1./node_modules/yuyi-core-env/config/run-ts.js %1./node_modules/yuyi-core-env/scripts/commit.ts %2
