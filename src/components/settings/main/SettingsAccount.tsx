import { getCurrentEmail } from 'src/session/CurrentUserProvider';
import { SettingsTextElement } from '../generic/SettingsTextElement';

export const SettingsAccount = () => {
    const email = getCurrentEmail();

    return <SettingsTextElement text={'Email'} secondaryText={email ?? ''} thirdaryText={''} />;
};
