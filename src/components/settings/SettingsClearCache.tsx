import { Image } from 'expo-image';
import { SettingsButtonElement } from './SettingsButtonElement';
import Toast from 'react-native-root-toast';

export const SettingsClearCache = () => {
    const clearCache = async () => {
        Toast.show('Cached Data Reset!', {
            duration: Toast.durations.LONG,
            containerStyle: { backgroundColor: 'white', marginBottom: 80 },
            textStyle: { color: 'black' },
        });

        await Image.clearDiskCache();
        await Image.clearMemoryCache();
    };

    return (
        <SettingsButtonElement
            text={'Clear Cache'}
            icon={'trash-bin-outline'}
            onPress={clearCache}
        />
    );
};
