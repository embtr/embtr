import { Linking } from 'react-native';
import { isAndroidDevice } from '../DeviceUtil';

export class UpdateUtility {
    public static updateIsAvailable(localVersion: string, databaseVersion: string) {
        const localVersionArray = localVersion.split('.');
        const databaseVersionArray = databaseVersion.split('.');

        for (let i = 0; i < localVersionArray.length; i++) {
            const localVersion = parseInt(localVersionArray[i]);
            const databaseVersion = parseInt(databaseVersionArray[i]);

            if (localVersion > databaseVersion) {
                return false;
            }

            if (localVersion < databaseVersion) {
                return true;
            }
        }

        return false;
    }

    public static navigateToAppStore = () => {
        if (isAndroidDevice()) {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.brentryczak.embtr');
        } else {
            Linking.openURL('itms-apps://');
        }
    };
}
