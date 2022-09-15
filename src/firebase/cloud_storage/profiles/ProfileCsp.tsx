import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export const uploadProfilePhoto = async (pickerResult: ImagePicker.ImagePickerResult): Promise<string | undefined> => {
    try {
        if (!pickerResult.cancelled) {
            const uploadUrl = await uploadImageAsync(pickerResult.uri, 'profiles/' + getAuth().currentUser?.uid, 'profile');
            return uploadUrl;
        }
    } catch (e) {
        alert('Upload failed, sorry :(');
    }
    return undefined;
};

export const uploadProfileBanner = async (pickerResult: ImagePicker.ImagePickerResult): Promise<string | undefined> => {
    try {
        if (!pickerResult.cancelled) {
            const uploadUrl = await uploadImageAsync(pickerResult.uri, 'profiles/' + getAuth().currentUser?.uid, 'banner');
            return uploadUrl;
        }
    } catch (e) {
        alert('Upload failed, sorry :(');
    }
    return undefined;
};

export const uploadImages = async (bucket: string, pickerResults: ImagePicker.ImagePickerResult[]): Promise<Promise<string>[] | undefined> => {
    let uploadUrls: Promise<string>[] = [];
    try {
        for (const pickerResult of pickerResults) {
            if (!pickerResult.cancelled) {
                const path = bucket + '/' + getAuth().currentUser?.uid + '/';
                const filename = hashString(pickerResult.uri) + '.png';
                const uploadUrl = uploadImageAsync(pickerResult.uri, path, filename);
                uploadUrls.push(uploadUrl);
            }
        }
    } catch (e) {
        console.log(e);
        alert('Upload failed, sorry :(');
    }

    return uploadUrls;
};

const uploadImageAsync = async (uri: string, path: string, filename: string): Promise<string> => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob: any = await createBlob(uri);
    const fullPath = path + (path.endsWith('/') ? '' : '/') + filename;
    let fileRef = ref(getStorage(), fullPath);

    const metadata = {
        cacheControl: 'public,max-age=604800',
    };

    const res = await uploadBytes(fileRef, blob, metadata);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
};

const createBlob = async (uri: string) => {
    const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log('BLOB ERROR', e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    return blob;
};

const hashString = function (str: string) {
    var hash = 0,
        i,
        chr;

    if (str.length === 0) {
        return hash;
    }

    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash;
};
