#!/bin/bash
pushd ..
npx standard-version 
git push
popd
