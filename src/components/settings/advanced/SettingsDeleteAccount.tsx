import { View, Alert } from 'react-native';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';
import UserController from 'src/controller/user/UserController';

export const SettingsDeleteAccount = () => {
    const handleOnDelete = async () => {
        await UserController.deleteUser();
        await UserController.logoutUser();
    };

    const onDelete = () => {
        Alert.alert(
            'Delete Acccount And Data',
            'Are you sure you want to delete your account and all associated data? This action cannot be undone.',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                {
                    text: 'I am sure. Delete it.',
                    style: 'destructive',
                    onPress: handleOnDelete,
                },
            ]
        );
    };

    return (
        <View>
            <SettingsButtonElement
                text={'Delete Account'}
                secondaryText={'Delete your account and all associated data.'}
                icon={'trash-bin-outline'}
                onPress={onDelete}
            />
        </View>
    );
};
