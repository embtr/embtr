import { EmbtrButton2 } from 'src/components/common/button/EmbtrButton2';

interface Props {
    text: string;
    secondaryText?: string;
    secondaryTextColor?: string;
    icon?: any;
    onPress: Function;
}

export const SettingsButtonElement = ({
    text,
    secondaryText,
    secondaryTextColor,
    icon,
    onPress,
}: Props) => {
    return (
        <EmbtrButton2
            text={text}
            secondaryText={secondaryText}
            secondaryTextColor={secondaryTextColor}
            icon={icon}
            onPress={onPress}
        />
    );
};
