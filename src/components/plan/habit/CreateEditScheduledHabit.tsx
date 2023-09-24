import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, Keyboard, TextInput, Switch } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { DayOfTheWeekToggle } from './DayOfTheWeekToggle';

export const CreateEditScheduledHabit = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'CreateEditScheduledHabit'>>();
    const { colors } = useTheme();

    const habitId = route.params.habitId;
    const habit = HabitCustomHooks.useHabit(Number(habitId));

    const [title, setTitle] = React.useState(habit?.title ?? '');
    const [description, setDescription] = React.useState('');
    const [repeating, setRepeating] = React.useState(false);

    //todo - implement me
    //const scheduledHabitId = route.params.scheduledHabitId;

    return (
        <Screen>
            <View
                style={{ height: '100%', width: '100%', paddingHorizontal: TIMELINE_CARD_PADDING }}
            >
                <Banner name={'Schedule Habit'} leftRoute="BACK" leftIcon={'arrow-back'} />

                {/* TITLE */}
                <View style={{ paddingTop: TIMELINE_CARD_PADDING }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 16,
                            }}
                        >
                            Title
                        </Text>

                        {title.length < 1 && (
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
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
                    <View style={{ paddingTop: TIMELINE_CARD_PADDING / 4 }}>
                        <TextInput
                            style={{
                                padding: TIMELINE_CARD_PADDING,
                                color: colors.text,
                                borderRadius: 12,
                                backgroundColor: colors.text_input_background,
                                borderColor: colors.text_input_border,
                                borderWidth: 1,
                                fontFamily: POPPINS_REGULAR,
                            }}
                            placeholder={'Give your habit a title'}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={setTitle}
                            value={title}
                        />
                    </View>
                </View>

                {/* DESCRIPTION */}
                <View
                    style={{
                        paddingTop: TIMELINE_CARD_PADDING * 2,
                    }}
                >
                    <Text
                        onPress={() => {
                            Keyboard.dismiss();
                        }}
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 16,
                        }}
                    >
                        Description
                    </Text>

                    <View style={{ paddingTop: TIMELINE_CARD_PADDING / 4 }}>
                        <TextInput
                            textAlignVertical="top"
                            style={{
                                height: 150,
                                borderRadius: 12,
                                padding: TIMELINE_CARD_PADDING,
                                backgroundColor: colors.text_input_background,
                                borderColor: colors.text_input_border,
                                borderWidth: 1,
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                            }}
                            multiline={true}
                            placeholder={'Enter some specifics about this habit.'}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={setDescription}
                            value={description}
                        />
                    </View>
                </View>

                <View
                    style={{
                        paddingTop: TIMELINE_CARD_PADDING * 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 16,
                            }}
                        >
                            Repeating Schedule
                        </Text>
                    </View>

                    <View style={{}}>
                        <Switch
                            style={{ height: 20 }}
                            trackColor={{
                                false: colors.secondary_text,
                                true: colors.accent_color,
                            }}
                            thumbColor={colors.toggle}
                            ios_backgroundColor={colors.toggle_background_unselected}
                            onValueChange={setRepeating}
                            value={repeating}
                        />
                    </View>
                </View>

                <View
                    style={{
                        paddingTop: TIMELINE_CARD_PADDING,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <DayOfTheWeekToggle dayOfTheWeek={'M'} onToggle={() => {}} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <DayOfTheWeekToggle dayOfTheWeek={'T'} onToggle={() => {}} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <DayOfTheWeekToggle dayOfTheWeek={'W'} onToggle={() => {}} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <DayOfTheWeekToggle dayOfTheWeek={'T'} onToggle={() => {}} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <DayOfTheWeekToggle dayOfTheWeek={'F'} onToggle={() => {}} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <DayOfTheWeekToggle dayOfTheWeek={'S'} onToggle={() => {}} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <DayOfTheWeekToggle dayOfTheWeek={'S'} onToggle={() => {}} />
                    </View>
                </View>
            </View>
        </Screen>
    );
};
