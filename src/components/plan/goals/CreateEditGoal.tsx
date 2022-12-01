import React from 'react';
import { View, Text, TextInput, Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PlanTabScreens, RootStackParamList } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { isIosApp } from 'src/util/DeviceUtil';
import GoalController, { FAKE_GOAL, GoalModel } from 'src/controller/planning/GoalController';
import { Timestamp } from 'firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import { EmbtrDropDownSelect } from 'src/components/common/dropdown/EmbtrDropDownSelect';
import { ItemType } from 'react-native-dropdown-picker';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { POPPINS_REGULAR } from 'src/util/constants';

export const CreateEditGoal = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'CreateEditGoal'>>();

    const [goal, setGoal] = React.useState<GoalModel>();
    const [name, setName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [deadline, setDeadline] = React.useState<Date>(Timestamp.now().toDate());
    const [pillarId, setPillarId] = React.useState('');
    const [selectedPillar, setSelectedPillar] = React.useState<PillarModel>();

    const [pillars, setPillars] = React.useState<PillarModel[]>([]);
    const [pillarOptions, setPillarOptions] = React.useState([]);

    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log(route.params);
        if (route.params.id) {
            GoalController.getGoal(getCurrentUid(), route.params.id, setGoal);
        } else {
            setGoal(FAKE_GOAL);
        }
    }, []);

    React.useEffect(() => {
        if (goal?.name) {
            setName(goal.name);
        }

        if (goal?.description) {
            setDescription(goal.description);
        }

        if (goal?.deadline) {
            setDeadline(goal.deadline.toDate());
        }
    }, [goal]);

    React.useEffect(() => {
        if (pillars && goal?.pillarId) {
            updateSelectedPillarById(goal.pillarId);
        }
    }, [pillars, goal]);

    React.useEffect(() => {
        PillarController.getPillars(getCurrentUid(), setPillars);
    }, []);

    React.useEffect(() => {
        let initialItems: any = [
            {
                label: 'Select a Pillar',
                value: '',
                selectedItemLabelStyle: { color: 'blue' },
                labelStyle: { color: colors.secondary_text },
                containerStyle: { marginLeft: 10, marginRight: 10 },
            },
        ];
        pillars.forEach((pillar) => {
            initialItems.push({ label: pillar.name, value: pillar.id, containerStyle: { marginLeft: 10, marginRight: 10 } });
        });

        setPillarOptions(initialItems);
    }, [pillars]);

    const save = async () => {
        if (!goal) {
            return;
        }

        const clone = GoalController.clone(goal);
        clone.name = name;
        clone.description = description;
        clone.deadline = Timestamp.fromDate(deadline);
        clone.pillarId = pillarId;
        if (clone.id) {
            await GoalController.update(clone);
            navigation.goBack();
        } else {
            GoalController.createGoal(clone, () => {
                navigation.goBack();
            });
        }
    };

    const showCalendar = () => {
        setCalendarVisible(true);
    };

    const hideCalendar = () => {
        setCalendarVisible(false);
    };

    const updateSelectedPillarFromObject = (pillarOption: ItemType<string>) => {
        if (pillarOption.value) {
            updateSelectedPillarById(pillarOption.value);
        } else {
            setPillarId('');
            setSelectedPillar(undefined);
        }
    };

    const updateSelectedPillarById = (pillarId: string) => {
        setPillarId(pillarId);
        pillars.forEach((pillar) => {
            if (pillar.id === pillarId) {
                setSelectedPillar(pillar);
                return;
            }
        });
    };

    const initialPillarItem: ItemType<string> = {
        label: selectedPillar?.name ? selectedPillar.name : 'Select a Goal',
        value: selectedPillar?.id ? selectedPillar.id : '',
    };

    return (
        <Screen>
            <Banner name={goal?.id ? 'Edit Goal' : 'Create Goal'} leftIcon={'arrow-back'} leftRoute={'BACK'} rightText={'Save'} rightOnClick={save} />

            <DateTimePickerModal
                isVisible={calendarVisible}
                mode="date"
                onConfirm={(date) => {
                    setDeadline(date);
                    hideCalendar();
                }}
                onCancel={hideCalendar}
            />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ height: '100%', width: '100%' }}>
                    <KeyboardAvoidingView
                        style={{ height: '100%' }}
                        keyboardVerticalOffset={isIosApp() ? -10 : 111}
                        behavior={isIosApp() ? 'padding' : 'height'}
                    >
                        {/* TOP DESCRIPTION */}
                        <View style={{ paddingTop: 5 }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 17, paddingTop: 10, paddingLeft: 15 }}
                            >
                                Bring it on!
                            </Text>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    color: colors.goal_secondary_font,
                                    fontFamily: 'Poppins_400Regular',
                                    paddingTop: 10,
                                    fontSize: 12,
                                    paddingLeft: 15,
                                    paddingRight: 15,
                                }}
                            >
                                Your goal should be some objective achievable by a certain date with clear pass/ fail criteria. Make it happen!.
                            </Text>
                        </View>

                        {/* Goal/ Title */}
                        <View style={{ paddingTop: 10, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    color: colors.goal_primary_font,
                                    paddingTop: 15,
                                    paddingLeft: 5,
                                    width: '95%',
                                    paddingBottom: 10,
                                    fontFamily: 'Poppins_400Regular',
                                }}
                            >
                                Goal
                            </Text>
                            <TextInput
                                style={{
                                    padding: 15,
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.goal_primary_font,
                                    borderRadius: 12,
                                    backgroundColor: colors.text_input_background,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    width: '95%',
                                }}
                                placeholder={'Enter your goal'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setName}
                                value={name}
                                autoCorrect={true}
                            />
                        </View>

                        {/* Description */}
                        <View style={{ paddingTop: 15, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.goal_primary_font, paddingLeft: 5, width: '95%', paddingBottom: 10, fontFamily: 'Poppins_400Regular' }}
                            >
                                Details
                            </Text>
                            <TextInput
                                textAlignVertical="top"
                                style={{
                                    width: '95%',
                                    fontFamily: 'Poppins_400Regular',
                                    height: 200,
                                    borderRadius: 12,
                                    backgroundColor: colors.text_input_background,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    color: colors.text,
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                }}
                                multiline={true}
                                placeholder={'What are the details of this goal?'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setDescription}
                                value={description}
                                autoCorrect={true}
                            />
                        </View>

                        <View style={{ paddingTop: 15, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10, fontFamily: 'Poppins_400Regular' }}
                            >
                                Pillar
                            </Text>
                            <EmbtrDropDownSelect
                                items={pillarOptions}
                                onItemSelected={updateSelectedPillarFromObject}
                                initial={initialPillarItem}
                                name={'Pillar'}
                            />
                        </View>

                        <View style={{ zIndex: -1, paddingTop: 15, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.goal_primary_font, paddingLeft: 5, width: '95%', paddingBottom: 10, fontFamily: 'Poppins_400Regular' }}
                            >
                                Deadline
                            </Text>

                            <View
                                style={{
                                    height: 50,
                                    width: '95%',
                                    borderRadius: 12,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    backgroundColor: colors.text_input_background,
                                    justifyContent: 'center',
                                    paddingLeft: 15,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text onPress={showCalendar} style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font, fontSize: 16 }}>
                                        {format(deadline, 'MMMM dd, yyyy')}
                                    </Text>
                                </View>

                                <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15, justifyContent: 'center' }}>
                                    <Ionicons name="calendar-outline" size={24} color={colors.goal_primary_font} onPress={showCalendar} />
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </Screen>
    );
};
