import Toast from 'react-native-root-toast';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';
import { AdminController } from 'src/controller/admin/AdminController';

export const SettingsDatabasePing = () => {
    const runTest = async () => {
        const start = new Date().getTime();
        const pingTest = await AdminController.databasePingTest();
        const end = new Date().getTime();
        const timeInMs = end - start;

        Toast.show('ping: ' + timeInMs + 'ms', {
            duration: Toast.durations.LONG,
            containerStyle: { backgroundColor: 'white', marginBottom: 80 },
            textStyle: { color: 'black' },
        });
    };

    return (
        <SettingsButtonElement
            text={'Database Ping Test'}
            icon={'timer-outline'}
            onPress={runTest}
        />
    );
};
