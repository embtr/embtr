import { pickImages } from 'src/util/ImagePickerUtil';
import { uploadImages } from 'src/firebase/cloud_storage/profiles/ProfileCsp';
import * as ImagePicker from 'expo-image-picker';

class ImageController {
    public static async uploadImages(bucket: string): Promise<Promise<string>[]> {
        const results: ImagePicker.ImagePickerMultipleResult = await pickImages();
        const images: ImagePicker.ImagePickerResult[] = results.selected;
        const urls = await uploadImages(bucket, images);

        if (urls) {
            return urls;
        }

        return [];
    }
}

export default ImageController;
