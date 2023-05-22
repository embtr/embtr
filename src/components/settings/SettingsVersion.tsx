import Constants from 'expo-constants';
import React from 'react';
import { Linking } from 'react-native';
import { SettingsTextElement } from 'src/components/settings/SettingsTextElement';
import { MetadataController, MetadataKey } from 'src/controller/metadata/MetadataController';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { UpdateUtility } from 'src/util/updates/UpdateUtility';

export const SettingsVersion = () => {
    const [version, setVersion] = React.useState<string>('');

    const fetch = async () => {
        const version = await MetadataController.getMetadata(MetadataKey.VERSION);
        if (version) {
            setVersion(version);
        }
    };

    React.useEffect(() => {
        fetch();
    }, []);

    const updateIsAvailable = UpdateUtility.updateIsAvailable(
        Constants!.manifest!.version!,
        version
    );

    const thirdaryText = updateIsAvailable ? 'Update available!' : '';

    return (
        <SettingsTextElement
            text={'Version'}
            secondaryText={Constants!.manifest!.version ?? ''}
            thirdaryText={thirdaryText}
            onPress={() => {
                if (updateIsAvailable) {
                    UpdateUtility.navigateToAppStore();
                }
            }}
        />
    );
};
