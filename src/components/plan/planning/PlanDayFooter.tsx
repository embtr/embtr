import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PADDING_LARGE, POPPINS_MEDIUM } from 'src/util/constants';

export const PlanDayFooter = () => {
    const selectedPlannedDayIsComplete = PlannedDayCustomHooks.useSelectedPlannedDayIsComplete();
    const colors = useTheme().colors;

    if (!selectedPlannedDayIsComplete) {
        return <View />;
    }

    return (
        <View
            style={{
                position: 'absolute',
                zIndex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                bottom: PADDING_LARGE * 2,
            }}
        >
            <View
                style={{
                    padding: PADDING_LARGE,
                    backgroundColor: colors.accent_color,
                    width: '100%',
                    alignItems: 'center',
                    borderRadius: 9,
                }}
            >
                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 16,
                    }}
                >
                    Share Your Results
                </Text>
            </View>
        </View>
    );
};
