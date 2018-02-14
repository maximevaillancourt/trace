#!/bin/bash

git pull --rebase origin master
npm install
truffle migrate --reset
