#!/bin/bash

cross-env \
    TS_NODE_PROJECT=tsconfig-for-webpack.json \
    NODE_ENV=production \
webpack
