import * as React from 'react';
import Constants from 'expo-constants';
import { SettingsTextElement } from 'src/components/settings/SettingsTextElement';

export const SettingsVersion = () => {
    return <SettingsTextElement text={"Version"} secondaryText={Constants!.manifest!.version} />
};