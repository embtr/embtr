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
        if (result.canceled || result.assets.length < 1) {
            return '';
        }

        const selectedImage: ImagePicker.ImagePickerAsset = result.assets[0];
        const url = await uploadImage(selectedImage, bucket);
        return url;
    }

    public static async pickAndUploadImages(bucket: string, imageUploadProgess?: Function): Promise<string[]> {
        const results: ImagePicker.ImagePickerResult = await pickImages();

        if (results.canceled || results.assets.length < 1) {
            return [];
        }

        const selectedImages: ImagePicker.ImagePickerAsset[] = results.assets;
        const urls = await uploadImages(selectedImages, bucket, imageUploadProgess);

        if (urls) {
            return urls;
        }

        return [];
    }
}

export default ImageController;
