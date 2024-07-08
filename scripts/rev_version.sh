#! /bin/bash

pushd .. > /dev/null

level=patch
if [[ "$1" == "major" ]]; then 
    level=major
elif [[ "$1" == "minor" ]]; then 
    level=minor
fi

dry=0
if [[ "$1" == "--dry" ]]; then 
    echo "dry run"
    dry=1
elif [[ "$2" == "--dry" ]]; then 
    echo "dry run"
    dry=1
fi

currentVersion="$(cat app.json | grep -o '"buildNumber": .*' | cut -d' ' -f2 | gsed 's/"//g' | tr -d '[:space:]')"
currentVersionCode="$(cat app.json | grep -o '"versionCode": [0-9]*' | cut -d' ' -f2)"

read -r major minor patch <<< "$(echo "$currentVersion" | tr '.' ' ')"
if [[ "$level" == "major" ]]; then 
    ((major++))
    minor=0
    patch=0
elif [[ "$level" == "minor" ]]; then 
    ((minor++))
    patch=0
else
    ((patch++))
fi
newVersion="$major.$minor.$patch"

# 001002003
# first three are major, next three are minor, last three are patch
read -r versionCodeMajor versionCodeMinor versionCodePatch <<< "$(echo "$currentVersionCode" | gsed 's/.\{3\}/& /g')"

if [[ "$level" == "major" ]]; then 
    versionCodeMajor=$(printf "%03d" $((10#$versionCodeMajor + 1)))
    versionCodeMinor=0
    versionCodePatch=0
elif [[ "$level" == "minor" ]]; then 
    versionCodeMinor=$(printf "%03d" $((10#$versionCodeMinor + 1)))
    versionCodePatch=0
else
    versionCodePatch=$(printf "%03d" $((10#$versionCodePatch + 1)))
fi

newVersionCode="$versionCodeMajor$versionCodeMinor$versionCodePatch"

if [[ $dry -eq 0 ]]; then
    gsed -i "s/\"$currentVersion/\"$newVersion/g" package.json
    gsed -i "s/\"$currentVersion/\"$newVersion/g" app.json
    gsed -i "s/$currentVersionCode/$newVersionCode/g" app.json
fi

echo "$currentVersion => $newVersion"
echo "$currentVersionCode => $newVersionCode"

popd > /dev/null
