import { ScrollView, View } from 'react-native';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { PADDING_LARGE } from 'src/util/constants';

export const ScheduledHabitIconSelector = () => {
    const { icon, setIcon } = useCreateEditScheduleHabit();

    const colors = useTheme().colors;
    const icons = HabitCustomHooks.useIcons();

    const elements: JSX.Element[] = [];
    for (const current of icons) {
        const optimalImageData: OptimalImageData = {
            remoteImageUrl: current.remoteImageUrl,
            localImage: current.localImage,
        };

        const isLast = current.id === icons[icons.length - 1].id;

        elements.push(
            <TouchableOpacity
                key={current.id}
                onPress={() => {
                    setIcon(current);
                }}
                style={{
                    height: 50,
                    width: 50,
                    marginLeft: PADDING_LARGE,
                    marginRight: isLast ? PADDING_LARGE : 0,
                }}
            >
                <View
                    key={current.id}
                    style={{
                        flex: 1,
                        borderRadius: 12,
                        backgroundColor:
                            current.id === icon?.id ? colors.accent_color_light : '#808080',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <OptimalImage data={optimalImageData} style={{ height: 37.5, width: 37.5 }} />
                </View>
            </TouchableOpacity>
        );
    }
    return (
        <View style={{ paddingBottom: PADDING_LARGE, width: '100%' }}>
            <ScrollView
                horizontal={true}
                style={{
                    backgroundColor: colors.background_light,
                    padding: PADDING_LARGE,
                    paddingLeft: 0,
                    borderRadius: 12,
                    width: '100%',
                    flexDirection: 'row',
                }}
            >
                {elements}
            </ScrollView>
        </View>
    );
};
