import { UserCustomHooks } from 'src/controller/user/UserController';
import { SettingsTextElement } from '../generic/SettingsTextElement';
import { UserPropertyCustomHooks } from 'src/controller/user/UserPropertyController';

export const SettingsTimezone = () => {
    // query server for stored timezone
    // if not found, use device timezone
    // also submit timezone to server when changed
    // finally, submit timezone on sign up
    //
    //
    // on press is going to open a modal with a list of timezones, on change will submit to server

    const userTimezone = UserPropertyCustomHooks.useTimezone();
    const timezone = userTimezone.data ?? 'n/a';

    return (
        <SettingsTextElement
            onPress={() => { }}
            text={'Timezone'}
            secondaryText={timezone}
            thirdaryText={''}
        />
    );
};
