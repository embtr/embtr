import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    progress: number;
    success?: boolean;
    showPercent?: boolean;
}

export const ProgressBar = ({ progress, success, showPercent }: Props) => {
    const { colors } = useTheme();

    let percentRemaining = progress === Number.POSITIVE_INFINITY ? 100 : Math.round(progress);
    if (isNaN(percentRemaining)) {
        percentRemaining = 100;
    }

    const percentProgess = '' + percentRemaining + '%';

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 5, backgroundColor: colors.progress_bar_color, borderRadius: 10 }}>
                <View
                    style={{
                        height: 6,
                        width: percentProgess,
                        backgroundColor:
                            success === false
                                ? colors.progress_bar_failed
                                : colors.progress_bar_complete,
                        borderRadius: 10,
                    }}
                ></View>
            </View>

            {showPercent && (
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: 'Poppins_500Medium',
                            fontSize: 11,
                            textAlign: 'center',
                            color:
                                success === false
                                    ? colors.progress_bar_failed
                                    : colors.progress_bar_complete,
                        }}
                    >
                        {' '}
                        {percentProgess}{' '}
                    </Text>
                </View>
            )}
        </View>
    );
};
