import { getAuth } from 'firebase/auth';
import UserController from 'src/controller/user/UserController';
import { useAppDispatch } from 'src/redux/Hooks';
import { resetToDefault } from 'src/redux/user/GlobalState';
import { SettingsButtonElement } from '../generic/SettingsButtonElement';

export const SettingsSignOut = () => {
    const dispatch = useAppDispatch();

    const onSignOut = async () => {
        await UserController.refreshToken();
        await getAuth().signOut();
        dispatch(resetToDefault);
    };

    return <SettingsButtonElement text={'Sign Out'} icon={'exit-outline'} onPress={onSignOut} />;
};
