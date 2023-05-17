import { SettingsTextElement } from 'src/components/settings/SettingsTextElement';
import { getCurrentEmail } from 'src/session/CurrentUserProvider';

export const SettingsAccount = () => {
    const email = getCurrentEmail();

    return <SettingsTextElement text={'Email'} secondaryText={email ?? ''} thirdaryText={''} />;
};
