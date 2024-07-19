import { View, Text } from 'react-native';
import { Constants } from 'resources/types/constants/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    progress: number;
    color?: string;
    status?: string;
    showPercent?: boolean;
}

export const ProgressBar = ({ progress, color, status, showPercent }: Props) => {
    const { colors } = useTheme();

    let currentProgress = progress === Number.POSITIVE_INFINITY ? 100 : Math.round(progress);
    if (isNaN(currentProgress)) {
        currentProgress = 100;
    }
    if (status === Constants.CompletionState.SKIPPED) {
        currentProgress = 100;
    }

    const percentProgess = '' + currentProgress + '%';

    const progressPercent = currentProgress + '%';

    return (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 5, backgroundColor: colors.progress_bar_color, borderRadius: 10 }}>
                <View
                    // @ts-ignore
                    style={{
                        width: progressPercent,
                        height: 6,
                        backgroundColor: color ?? colors.secondary_accent_color,
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
                            color: color ?? colors.secondary_accent_color,
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
