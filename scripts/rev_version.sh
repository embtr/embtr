#! /bin/bash

pushd ..

currentVersion="$(cat app.json | grep -o '"buildNumber": .*' | cut -d' ' -f2 | sed 's/"//g' | tr -d '[:space:]')"
currentVersionCode="$(cat app.json | grep -o '"versionCode": [0-9]*' | cut -d' ' -f2)"

read -r major minor patch <<< "$(echo "$currentVersion" | tr '.' ' ')"
((patch++))
newVersion="$major.$minor.$patch"

read -r versionCode <<< "$(echo "$currentVersionCode")"
((versionCode++))
newVersionCode="$versionCode"

sed -i "s/\"$currentVersion/\"$newVersion/g" package.json
sed -i "s/\"$currentVersion/\"$newVersion/g" app.json
sed -i "s/$currentVersionCode/$newVersionCode/g" app.json

echo "$currentVersion => $newVersion"
echo "$currentVersionCode => $newVersionCode"

popd
