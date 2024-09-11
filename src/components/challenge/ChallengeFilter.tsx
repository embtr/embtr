import { Pressable, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PADDING_SMALL } from 'src/util/constants';
import { Constants } from 'resources/types/constants/constants';

interface Props {
    option: Constants.ChallengeFilterOption;
    selected: boolean;
    onPressed: Function;
}

export const ChallengeFilter = ({ option, selected, onPressed }: Props) => {
    const colors = useTheme().colors;

    const name = option
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <Pressable
            style={{
                alignContent: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                backgroundColor: selected ? colors.accent_color : colors.background_light,
                padding: PADDING_SMALL,
            }}
            onPress={() => {
                onPressed();
            }}
        >
            <Text style={{ textAlign: 'center', color: colors.text }}>{name}</Text>
        </Pressable>
    );
};
