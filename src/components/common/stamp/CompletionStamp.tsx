import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';

const CompletionStamp = () => {
    const { colors } = useTheme();
    return (
        <View
            style={{
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    borderWidth: 2,
                    borderColor: colors.tab_selected, // Customize the color of the stamp
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    transform: [{ rotate: '-30deg' }], // Rotate the stamp by -45 degrees
                    borderRadius: 5,
                }}
            >
                <Text
                    style={{
                        color: colors.tab_selected, // Customize the color of the tex
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 12,
                    }}
                >
                    Complete
                </Text>
            </View>
        </View>
    );
};

export default CompletionStamp;
