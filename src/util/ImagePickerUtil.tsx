import * as ImagePicker from 'expo-image-picker';

export const pickImage = async (): Promise<ImagePicker.ImagePickerResult> => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
    });

    return pickerResult;
};

export const pickImages = async (): Promise<ImagePicker.ImagePickerResult> => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
    });

    return pickerResult;
};
