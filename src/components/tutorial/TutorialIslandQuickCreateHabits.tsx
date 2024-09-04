import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Screen } from '../common/Screen';
import { Ionicons } from '@expo/vector-icons';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { AddHabitElement } from '../plan/habit/AddHabitElement';
import { TextInput } from 'react-native-gesture-handler';
import { useTheme } from '../theme/ThemeProvider';
import { HabitController, HabitCustomHooks } from 'src/controller/habit/HabitController';
import { Task } from 'resources/schema';
import { useEmbtrTutorialIslandNavigation } from 'src/hooks/NavigationHooks';
import { TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { TutorialIslandOptionKey } from 'src/model/tutorial_island/TutorialIslandModels';
import { TutorialIslandElement, TutorialIslandElementRef } from './TutorialIslandElement';
import PlannedDayController, { getTodayKey } from 'src/controller/planning/PlannedDayController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';

interface ImplProps {
    tasks: Task[];
}

export const TutorialIslandQuickCreateHabitsImpl = ({ tasks }: ImplProps) => {
    const colors = useTheme().colors;
    const navigation = useEmbtrTutorialIslandNavigation();

    const [habitText, setHabitText] = React.useState('');

    const onSubmitPressed = async (id?: number, text?: string) => {
        await HabitController.tutorialHabitSelected(id, text);

        const currentUserId = (await getUserIdFromToken()) ?? 0;
        const currentDayKey = getTodayKey();
        PlannedDayController.invalidatePlannedDay(currentUserId, currentDayKey);

        navigation.navigate(TutorialIslandRoutes.TUTORIAL_ISLAND_TODAY);
        ref.current?.reportOptionPressed();
    };

    const submitTextInvalid = habitText.length === 0;

    const ref = React.useRef<TutorialIslandElementRef>(null);

    const elements: JSX.Element[] = [];
    for (const task of tasks) {
        elements.push(
            <TouchableOpacity
                key={task.id}
                onPress={async () => {
                    await onSubmitPressed(task.id, undefined);
                }}
            >
                <AddHabitElement
                    optimalImageData={{ icon: task.icon }}
                    name={task.title ?? ''}
                    description={task.description ?? ''}
                />
            </TouchableOpacity>
        );
    }

    return (
        <Screen>
            <TutorialIslandElement
                ref={ref}
                optionKey={TutorialIslandOptionKey.QUICK_CREATE_HABITS__CREATE_HABITS}
            >
                <View />
            </TutorialIslandElement>

            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // Add extra padding at the bottom
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={100} // Add extra scroll height
                enableOnAndroid={true} // Enable for Android as well
            >
                <View style={{ height: PADDING_LARGE * 2 }} />

                <View style={{ paddingHorizontal: PADDING_LARGE }}>
                    <View
                        style={{
                            paddingHorizontal: PADDING_LARGE,
                            borderColor: '#404040',
                            backgroundColor: colors.accent_color_soft,
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignContent: 'center',
                            borderRadius: 5,
                            padding: PADDING_SMALL,
                            marginBottom: PADDING_LARGE,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        flex: 1,
                                        top: 2,
                                        color: colors.text,
                                        fontSize: 16,
                                        fontFamily: POPPINS_MEDIUM,
                                    }}
                                >
                                    Select Your First Habit!
                                </Text>
                                <Text
                                    style={{
                                        flex: 1,
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        paddingTop: PADDING_SMALL,
                                    }}
                                >
                                    Choose a habit or create your own to get started on your
                                    journey.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ height: PADDING_LARGE }} />

                {elements}

                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View style={{ height: PADDING_LARGE }} />
                    <View
                        style={{
                            paddingHorizontal: PADDING_LARGE,
                            width: '100%',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#282828',
                                borderRadius: 5,
                                padding: PADDING_LARGE,
                                width: '100%',
                                flexDirection: 'row',
                            }}
                        >
                            <TextInput
                                style={{
                                    color: colors.text,
                                    width: '100%',
                                }}
                                textAlignVertical="top"
                                placeholder={'Or create your own...'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setHabitText}
                                value={habitText}
                            />

                            <View
                                style={{
                                    right: PADDING_LARGE * 2,
                                    opacity: submitTextInvalid ? 0.3 : 1,
                                }}
                            >
                                <Ionicons
                                    onPress={async () => {
                                        await onSubmitPressed(undefined, habitText);
                                    }}
                                    name={'chevron-forward-outline'}
                                    size={18}
                                    color={colors.link}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </Screen>
    );
};

export const TutorialIslandQuickCreateHabits = () => {
    const tutorialHabits = HabitCustomHooks.useTutorialRecommendedHabits();
    if (!tutorialHabits) {
        return (
            <Screen>
                <View style={{ flex: 1 }} />
            </Screen>
        );
    }

    return <TutorialIslandQuickCreateHabitsImpl tasks={tutorialHabits} />;
};
