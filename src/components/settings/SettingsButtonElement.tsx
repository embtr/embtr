import * as React from 'react';
import { EmbtrButton2 } from 'src/components/common/button/EmbtrButton2';

interface Props {
    text: string,
    icon?: any,
    onPress: Function
}

export const SettingsButtonElement = ({ text, icon, onPress }: Props) => {
    return <EmbtrButton2 text={text} icon={icon} onPress={onPress} />
};