import { pickImage, pickImages } from 'src/util/ImagePickerUtil';
import { uploadImage, uploadImages } from 'src/firebase/cloud_storage/profiles/ProfileCsp';
import * as ImagePicker from 'expo-image-picker';

export interface ImageUploadProgressReport {
    completed: number;
    total: number;
}

class ImageController {
    public static async pickAndUploadImage(bucket: string): Promise<string> {
        const result: ImagePicker.ImagePickerResult = await pickImage();
        if (result.cancelled) {
            return '';
        }

        const url = await uploadImage(result, bucket);
        return url;
    }

    public static async pickAndUploadImages(bucket: string, imageUploadProgess?: Function): Promise<string[]> {
        const results: ImagePicker.ImagePickerMultipleResult = await pickImages();
        if (results.cancelled) {
            return [];
        }

        const urls = await uploadImages(results.selected, bucket, imageUploadProgess);

        if (urls) {
            return urls;
        }

        return [];
    }
}

export default ImageController;
