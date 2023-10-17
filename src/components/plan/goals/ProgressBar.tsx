import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    progress: number;
    status?: string;
    showPercent?: boolean;
}

export const ProgressBar = ({ progress, status, showPercent }: Props) => {
    const { colors } = useTheme();

    let currentProgress = progress === Number.POSITIVE_INFINITY ? 100 : Math.round(progress);
    if (isNaN(currentProgress)) {
        currentProgress = 100;
    }
    if (status === 'SKIPPED') {
        currentProgress = 100;
    }

    const percentProgess = '' + currentProgress + '%';

    let color = colors.progress_bar_complete;
    if (status === 'SKIPPED') {
        color = colors.trophy_icon;
    } else if (status === 'FAILED') {
        color = colors.progress_bar_failed;
    }

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 5, backgroundColor: colors.progress_bar_color, borderRadius: 10 }}>
                <View
                    style={{
                        width: currentProgress + '%',
                        height: 6,
                        backgroundColor: color,
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
                            color,
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
