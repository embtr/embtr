import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { PlannedDay } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Routes } from 'src/navigation/RootStackParamList';
import { POPPINS_REGULAR } from 'src/util/constants';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';

interface Styles {
    container: ViewStyle;
    topText: TextStyle;
    bottomTextContainer: ViewStyle;
    bottomText: TextStyle;
}

const generateStyles = (colors: any): Styles => {
    return {
        container: {
            height: 60,
            borderColor: '#404040',
            backgroundColor: '#343434',
            borderWidth: 1,
            justifyContent: 'center',
            alignContent: 'center',
            borderRadius: 5,
        },
        topText: {
            flex: 1,
            top: 2,
            color: colors.secondary_text,
            fontFamily: POPPINS_REGULAR,
            textAlign: 'center',
        },
        bottomTextContainer: {
            flex: 1,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
        },
        bottomText: {
            top: 2,
            color: colors.accent_color_light,
            includeFontPadding: false,
            fontFamily: POPPINS_REGULAR,
        },
    };
};

interface Props {
    hasPlannedTasks: boolean;
}

export const PlanDayHeader = ({ hasPlannedTasks }: Props) => {
    const { colors } = useTheme();
    const styles = generateStyles(colors);

    const navigation = useEmbtrNavigation();

    let header = undefined;
    if (!hasPlannedTasks) {
        header = (
            <View style={styles.container}>
                <Text style={styles.topText}>No habits planned for today...</Text>
                <View style={styles.bottomTextContainer}>
                    <Text
                        onPress={() => {
                            // @ts-ignore :(
                            navigation.navigate('MyHabitsTab');
                        }}
                        style={styles.bottomText}
                    >
                        Manage Your Habits
                    </Text>
                </View>
            </View>
        );
    } else {
        header = <View></View>;
    }

    return header;
};
