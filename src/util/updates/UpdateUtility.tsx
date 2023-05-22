import { Linking } from 'react-native';
import { isAndroidDevice } from '../DeviceUtil';

export class UpdateUtility {
    public static updateIsAvailable(localVersion: string, databaseVersion: string) {
        const localVersionArray = localVersion.split('.');
        const databaseVersionArray = databaseVersion.split('.');
        for (let i = 0; i < localVersionArray.length; i++) {
            if (parseInt(localVersionArray[i]) < parseInt(databaseVersionArray[i])) {
                return true;
            }
        }
        return false;
    }

    public static navigateToAppStore = () => {
        if (isAndroidDevice()) {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.brentryczak.embtr');
        } else {
            Linking.openURL('itms-beta://');
        }
    };
}
