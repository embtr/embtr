import { Image } from 'expo-image';
import Toast from 'react-native-root-toast';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';
import { AdminController } from 'src/controller/admin/AdminController';

export const SettingsPing = () => {
    const runTest = async () => {
        //time api call
        const start = new Date().getTime();
        for (let i = 0; i < 100; i++) {
            const pingTest = await AdminController.pingTest();
        }
        const end = new Date().getTime();
        const timeInMs = (end - start) / 100;

        Toast.show('ping: ' + timeInMs + 'ms', {
            duration: Toast.durations.LONG,
            containerStyle: { backgroundColor: 'white', marginBottom: 80 },
            textStyle: { color: 'black' },
        });
    };

    return <SettingsButtonElement text={'Ping Test'} icon={'clock-outline'} onPress={runTest} />;
};
