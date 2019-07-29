@echo off

node -r %1/node_modules/@yuyi/env/config/run-ts.js %1/node_modules/@yuyi/env/scripts/commit.ts %2
