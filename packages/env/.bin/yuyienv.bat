@echo off

node -r %1/node_modules/@yuyi919/env/config/run-ts.js %1/node_modules/@yuyi919/env/scripts/commit.ts %2
