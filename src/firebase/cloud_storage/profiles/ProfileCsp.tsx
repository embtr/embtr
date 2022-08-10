import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


export const uploadProfilePhoto = async (pickerResult: ImagePicker.ImagePickerResult): Promise<string | undefined> => {
    try {
        if (!pickerResult.cancelled) {
            const uploadUrl = await uploadImageAsync(pickerResult.uri);
            return uploadUrl;
        }
    } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
    }
    return undefined;
};

const uploadImageAsync = async (uri: string): Promise<string> => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });

    const fileRef = ref(getStorage(), "profiles/" + getAuth().currentUser?.uid + "/test.png");
    await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
}