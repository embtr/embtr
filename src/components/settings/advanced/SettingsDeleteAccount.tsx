import { SettingsButtonElement } from '../generic/SettingsButtonElement';

export const SettingsDeleteAccount = () => {
    const clearCache = async () => {
    };

    return (
        <SettingsButtonElement
            text={'Delete Account'}
            icon={'trash-bin-outline'}
            onPress={clearCache}
        />
    );
};

