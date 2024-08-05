import { Text, View } from 'react-native';
import { Constants } from 'resources/types/constants/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    type: Constants.LeaderboardType;
    isSelected: boolean;
}

export const LeaderboardSelectorElement = ({ type, isSelected }: Props) => {
    const colors = useTheme().colors;

    const displayName = type
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <View
            style={{
                backgroundColor: colors.card_background,
                borderColor: isSelected ? colors.secondary_text : colors.card_background,
                borderWidth: 1,
                borderRadius: 3,
            }}
        >
            <Text
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_REGULAR,
                    fontSize: 13,
                    padding: PADDING_SMALL,
                }}
            >
                {displayName}
            </Text>
        </View>
    );
};
