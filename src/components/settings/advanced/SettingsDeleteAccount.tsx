import UserController from 'src/controller/user/UserController';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';

export const SettingsDeleteAccount = () => {
    const deleteAccount = async () => {
        await UserController.deleteUser();
        await UserController.logoutUser();
    };

    return (
        <SettingsButtonElement
            text={'Delete Account'}
            secondaryText={'Warning: this will delete your account and all associated data.'}
            icon={'trash-bin-outline'}
            onPress={deleteAccount}
        />
    );
};
