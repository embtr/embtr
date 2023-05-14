import Constants from 'expo-constants';
import React from 'react';
import { SettingsTextElement } from 'src/components/settings/SettingsTextElement';
import { MetadataController, MetadataKey } from 'src/controller/metadata/MetadataController';

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

    const updateAvailable = (localVersion: string, databaseVersion: string) => {
        const localVersionArray = localVersion.split('.');
        const databaseVersionArray = databaseVersion.split('.');
        for (let i = 0; i < localVersionArray.length; i++) {
            if (parseInt(localVersionArray[i]) < parseInt(databaseVersionArray[i])) {
                return true;
            }
        }
        return false;
    };

    const thirdaryText = updateAvailable(Constants!.manifest!.version!, version)
        ? 'Update available!'
        : '';

    return (
        <SettingsTextElement
            text={'Version'}
            secondaryText={Constants!.manifest!.version ?? ''}
            thirdaryText={thirdaryText}
        />
    );
};
