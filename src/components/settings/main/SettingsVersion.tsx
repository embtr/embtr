import Constants from 'expo-constants';
import React from 'react';
import { MetadataController, MetadataKey } from 'src/controller/metadata/MetadataController';
import { UpdateUtility } from 'src/util/updates/UpdateUtility';
import { SettingsTextElement } from '../generic/SettingsTextElement';

export const SettingsVersion = () => {
    const [latestReleasedVersion, setLatestReleasedVersion] = React.useState<string>('');

    const fetch = async () => {
        const latestReleasedVersion = await MetadataController.getMetadata(MetadataKey.VERSION);
        if (latestReleasedVersion) {
            setLatestReleasedVersion(latestReleasedVersion);
        }
    };

    React.useEffect(() => {
        fetch();
    }, []);

    const currentVersion = Constants.expoConfig?.version ?? '';

    const updateIsAvailable = UpdateUtility.updateIsAvailable(
        currentVersion,
        latestReleasedVersion
    );

    const thirdaryText = updateIsAvailable ? 'Update available!' : '';

    return (
        <SettingsTextElement
            text={'Version'}
            secondaryText={currentVersion}
            thirdaryText={thirdaryText}
            onPress={() => {
                if (updateIsAvailable) {
                    UpdateUtility.navigateToAppStore();
                }
            }}
        />
    );
};
