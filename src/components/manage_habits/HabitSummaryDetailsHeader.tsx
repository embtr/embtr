import { View, Text } from 'react-native';
import { PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { OptimalImage, OptimalImageData } from '../common/images/OptimalImage';
import { HabitSummary } from 'resources/types/habit/Habit';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
    habitSummary: HabitSummary;
}

export const HabitSummaryDetailsHeader = ({ habitSummary }: Props) => {
    const colors = useTheme().colors;
    const optimalImageData: OptimalImageData = {
        localImage: habitSummary.task.localImage,
        remoteImageUrl: habitSummary.task.remoteImageUrl,
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <View>
                <View style={{ height: 65, width: 65 }}>
                    <OptimalImage data={optimalImageData} style={{ height: 65, width: 65 }} />
                </View>
            </View>

            <View style={{ width: PADDING_LARGE }} />

            <View
                style={{
                    flex: 1,
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 22,
                    }}
                >
                    {habitSummary.task.title}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        numberOfLines={2}
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 14,
                        }}
                    >
                        {habitSummary.task.description ?? ''}
                    </Text>
                    <View style={{ flex: 1 }} />
                </View>
            </View>
        </View>
    );
};
