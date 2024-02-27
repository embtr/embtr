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

currentVersion="$(cat app.json | grep -o '"buildNumber": .*' | cut -d' ' -f2 | sed 's/"//g' | tr -d '[:space:]')"
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
read -r versionCodeMajor versionCodeMinor versionCodePatch <<< "$(echo "$currentVersionCode" | sed 's/.\{3\}/& /g')"

if [[ "$level" == "major" ]]; then 
    ((versionCodeMajor++))
    versionCodeMinor=0
    versionCodePatch=0
elif [[ "$level" == "minor" ]]; then 
    ((versionCodeMinor++))
    versionCodePatch=0
else
    ((versionCodePatch++))
fi

zeroPaddedMajor="$(printf "%03d" $versionCodeMajor)"
zeroPaddedMinor="$(printf "%03d" $versionCodeMinor)"
zeroPaddedPatch="$(printf "%03d" $versionCodePatch)"
newVersionCode="$zeroPaddedMajor$zeroPaddedMinor$zeroPaddedPatch"

if [[ dry -eq 0 ]]; then 
    sed -i "s/\"$currentVersion/\"$newVersion/g" package.json
    sed -i "s/\"$currentVersion/\"$newVersion/g" app.json
    sed -i "s/$currentVersionCode/$newVersionCode/g" app.json
fi

echo "$currentVersion => $newVersion"
echo "$currentVersionCode => $newVersionCode"

popd > /dev/null
