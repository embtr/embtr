import React from 'react';
import { Text } from 'react-native';
import { CARD_SHADOW, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
    key: string;
    name: string;
    isSelected: boolean;
    onPress: () => void;
}

export const ManageHabitsTimePeriodButton = ({ key, name, isSelected, onPress }: Props) => {
    const colors = useTheme().colors;

    const buttonBackgroundColor = '#404040';
    const opaqueButtonBackgroundColor = 'rgba(64, 64, 64, 0.4)';

    return (
        <TouchableOpacity
            onPress={() => {
                onPress();
            }}
            style={[
                {
                    flexDirection: 'row',
                    backgroundColor: isSelected
                        ? buttonBackgroundColor
                        : opaqueButtonBackgroundColor,
                    borderRadius: 5,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                },
                CARD_SHADOW,
            ]}
        >
            <Text
                style={{
                    color: isSelected ? colors.text : colors.secondary_text,

                    fontSize: 12,
                    fontFamily: POPPINS_REGULAR,
                    paddingHorizontal: PADDING_SMALL / 2,
                }}
            >
                {name}
            </Text>
        </TouchableOpacity>
    );
};
