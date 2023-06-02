import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';

export const uploadImages = async (
    pickerResults: ImagePicker.ImagePickerAsset[],
    bucket: string,
    reportImageUploadProgress?: Function
): Promise<string[] | undefined> => {
    let uploadUrls: string[] = [];
    try {
        let count = 0;
        for (const pickerResult of pickerResults) {
            count++;
            if (reportImageUploadProgress) {
                const uploadProgressReport: ImageUploadProgressReport = {
                    completed: count,
                    total: pickerResults.length,
                };
                reportImageUploadProgress(uploadProgressReport);
            }

            const uploadUrl = await uploadImage(pickerResult, bucket);
            uploadUrls.push(uploadUrl);
        }
    } catch (e) {
        console.log(e);
        alert('Upload failed, sorry :(');
    }

    return uploadUrls;
};

export const uploadImage = async (
    pickerResult: ImagePicker.ImagePickerAsset,
    bucket: string
): Promise<string> => {
    if (!pickerResult) {
        return '';
    }

    const filename = hashString(pickerResult.uri) + '.png';
    const path = bucket + '/' + getAuth().currentUser?.uid + '/';

    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob: any = await createBlob(pickerResult.uri);
    const fullPath = path + (path.endsWith('/') ? '' : '/') + filename;
    let fileRef = ref(getStorage(), fullPath);

    const metadata = {
        cacheControl: 'public,max-age=604800',
    };

    const res = await uploadBytesResumable(fileRef, blob, metadata);

    // We're done with the blob, close and release it
    if (typeof blob.close === 'function') {
        blob.close();
    }

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
