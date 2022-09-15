import { pickImages } from 'src/util/ImagePickerUtil';
import { uploadImages } from 'src/firebase/cloud_storage/profiles/ProfileCsp';
import * as ImagePicker from 'expo-image-picker';

export interface ImageUploadProgressReport {
    completed: number;
    total: number;
}

class ImageController {
    public static async uploadImages(bucket: string, imageUploadProgess?: Function): Promise<string[]> {
        const results: ImagePicker.ImagePickerMultipleResult = await pickImages();
        const images: ImagePicker.ImagePickerResult[] = results.selected;
        const urls = await uploadImages(bucket, images, imageUploadProgess);

        if (urls) {
            return urls;
        }

        return [];
    }
}

export default ImageController;
