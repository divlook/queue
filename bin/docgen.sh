#!/bin/bash

typedoc \
    --excludePrivate \
    --includeVersion \
    --out docs \
    src/queue.ts
