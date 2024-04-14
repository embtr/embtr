import { View, Text } from 'react-native';
import { Constants } from 'resources/types/constants/constants';
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
    if (status === Constants.CompletionState.SKIPPED) {
        currentProgress = 100;
    }

    const percentProgess = '' + currentProgress + '%';

    let color = colors.progress_bar_complete;
    if (status === Constants.CompletionState.SKIPPED) {
        color = colors.progress_bar_skipped;
    } else if (status === Constants.CompletionState.FAILED) {
        color = colors.progress_bar_failed;
    }

    const progressPercent = currentProgress + '%';

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 5, backgroundColor: colors.progress_bar_color, borderRadius: 10 }}>
                <View
                    // @ts-ignore
                    style={{
                        width: progressPercent,
                        height: 6,
                        backgroundColor: color,
                        borderRadius: 10,
                    }}
                />
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
