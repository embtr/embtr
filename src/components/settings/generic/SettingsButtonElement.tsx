import { EmbtrButton2 } from 'src/components/common/button/EmbtrButton2';

interface Props {
    text: string;
    secondaryText?: string;
    icon?: any;
    onPress: Function;
}

export const SettingsButtonElement = ({ text, secondaryText, icon, onPress }: Props) => {
    return <EmbtrButton2 text={text} secondaryText={secondaryText} icon={icon} onPress={onPress} />;
};
