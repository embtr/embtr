import { Animated, Pressable, Text, TextInput, View } from 'react-native';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';
import React from 'react';
import { runCreateEditScheduledHabitAnimation } from './CreateEditScheduledHabit';
import { ScheduledHabitIconSelector } from './ScheduledHabitIconSelector';

export const ScheduledHabitTitle = () => {
    const { colors } = useTheme();
    const { icon, remoteImageUrl, localImage, title, setTitle, isChallenge } =
        useCreateEditScheduleHabit();
    const [selectIconExpanded, setSelectIconExpanded] = React.useState<boolean>(false);
    const [iconSelectionViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));

    const SELECT_ICON_VIEW_HEIGHT = 50 + PADDING_LARGE + PADDING_LARGE * 2;
    React.useEffect(() => {
        runCreateEditScheduledHabitAnimation(
            selectIconExpanded,
            iconSelectionViewHeight,
            SELECT_ICON_VIEW_HEIGHT
        );
    }, [selectIconExpanded]);

    const optimalImageData: OptimalImageData = {
        icon: icon,
        remoteImageUrl: remoteImageUrl,
        localImage: localImage,
    };

    return (
        <View style={{}}>
            <View style={{ paddingBottom: PADDING_LARGE }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 16,
                        }}
                    >
                        Habit
                    </Text>

                    {title.length < 1 && (
                        <Text
                            style={{
                                alignSelf: 'flex-end',
                                color: colors.tab_selected,
                                paddingLeft: 5,
                                paddingBottom: 3,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 10,
                            }}
                        >
                            cannot be blank
                        </Text>
                    )}
                </View>
                <View
                    style={{
                        paddingTop: PADDING_LARGE / 4,
                        flexDirection: 'row',
                        opacity: isChallenge ? 0.5 : 1,
                        pointerEvents: isChallenge ? 'none' : undefined,
                    }}
                >
                    <Pressable
                        onPress={() => {
                            setSelectIconExpanded(!selectIconExpanded);
                        }}
                    >
                        <View
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: 12,
                                backgroundColor: colors.background_light,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <OptimalImage
                                data={optimalImageData}
                                style={{ height: 37.5, width: 37.5 }}
                            />
                        </View>
                    </Pressable>
                    <View style={{ width: PADDING_LARGE }} />
                    <TextInput
                        style={{
                            height: 50,
                            padding: PADDING_LARGE,
                            flex: 1,
                            color: colors.text,
                            borderRadius: 12,
                            backgroundColor: colors.background_light,
                            fontFamily: POPPINS_REGULAR,
                        }}
                        placeholder={'Give your habit a title'}
                        placeholderTextColor={colors.secondary_text}
                        onChangeText={setTitle}
                        value={title}
                    />
                </View>
            </View>

            <Animated.View
                style={{
                    flexDirection: 'row',
                    height: iconSelectionViewHeight,
                    overflow: 'hidden',
                }}
            >
                <ScheduledHabitIconSelector />
            </Animated.View>
        </View>
    );
};
