import { SettingsButtonElement } from '../generic/SettingsButtonElement';
import { SignOutCustomHooks } from 'src/util/user/SignOutUtility';

export const SettingsSignOut = () => {
    const signOut = SignOutCustomHooks.useSignOut();

    return <SettingsButtonElement text={'Sign Out'} icon={'exit-outline'} onPress={signOut} />;
};
