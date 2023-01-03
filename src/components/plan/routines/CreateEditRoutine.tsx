import React from 'react';
import { View, Text, Keyboard, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PlanTabScreens, RootStackParamList } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { isIosApp } from 'src/util/DeviceUtil';
import { Screen } from 'src/components/common/Screen';
import { StackNavigationProp } from '@react-navigation/stack';
import { POPPINS_REGULAR_ITALIC, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { RandomPlaceHolderTextInput } from 'src/components/common/textbox/RandomPlaceholderTextInput';
import RoutineController, { createRoutineModel, FAKE_ROUTINE, RoutineModel } from 'src/controller/routine/RoutineController';
import { AddHabitModal } from '../planning/AddHabitModal';
import { TaskModel } from 'src/controller/planning/TaskController';
import { RoutineHabit } from './RoutineHabit';
import RoutineHabitController, { createRoutineHabitModels, RoutineHabitModel } from 'src/controller/routine/RoutineHabitController';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { getRandomInt } from 'src/util/GeneralUtility';

export const CreateEditRoutine = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'CreateEditRoutine'>>();

    const [routine, setRoutine] = React.useState<RoutineModel>(FAKE_ROUTINE);
    const [name, setName] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [showAddHabitsModal, setShowAddHabitsModal] = React.useState(false);
    const [routineHabits, setRoutineHabits] = React.useState<RoutineHabitModel[]>([]);

    const placeholderOptions = ['Morning Routine', 'Workout Routine'];

    React.useEffect(() => {
        if (route.params.id) {
            fetchRoutine();
        } else {
            setRoutine(FAKE_ROUTINE);
        }
    }, []);

    const fetchRoutine = async () => {
        const routine = await RoutineController.get(route.params.id!);
        const routineHabits = await RoutineHabitController.getAllInRoutine(routine);

        setRoutine(routine);
        setName(routine.name);
        setDetails(routine.description);
        setRoutineHabits(routineHabits);
    };

    const save = async () => {
        if (routine.id) {
            await updateRoutine();
            await updateRoutineHabits();
        } else {
            await createRoutine();
        }

        navigation.goBack();
    };

    const updateRoutine = async () => {
        const clone = { ...routine };
        clone.name = name;
        clone.description = details;

        await RoutineController.update(clone);
    };

    const updateRoutineHabits = async () => {
        for (const routineHabit of routineHabits) {
            routineHabit.routineId = routine.id;

            if (routineHabit.id) {
                await RoutineHabitController.update(routineHabit);
            } else {
                await RoutineHabitController.create(routineHabit);
            }
        }
    };

    const createRoutine = async () => {
        const routineToCreate = createRoutineModel(name, details);
        const createdRoutine = await RoutineController.create(routineToCreate);
        await createRoutineHabits(createdRoutine);
    };

    const createRoutineHabits = async (routine: RoutineModel) => {
        for (const routineHabit of routineHabits) {
            routineHabit.routineId = routine.id;
            RoutineHabitController.create(routineHabit);
        }
    };

    const confirmHabits = (selectedHabits: TaskModel[]) => {
        let clone = [...routineHabits];
        const createdRoutineHabits = createRoutineHabitModels(FAKE_ROUTINE, selectedHabits);
        clone = clone.concat(createdRoutineHabits);

        setRoutineHabits(clone);
    };

    const onRoutineHabitUpdated = (updatedRoutineHabit: RoutineHabitModel) => {
        const updatedRoutineHabits: RoutineHabitModel[] = [];
        routineHabits.forEach((routineHabit) => {
            if (routineHabit.id === updatedRoutineHabit.id) {
                return;
            }
            updatedRoutineHabits.push(routineHabit);
        });

        updatedRoutineHabits.push(updatedRoutineHabit);
        setRoutineHabits(updatedRoutineHabits);
    };

    const habitViews: JSX.Element[] = [];
    routineHabits.forEach((routineHabit) => {
        if (!routineHabit.active) {
            return;
        }

        habitViews.push(
            <View key={routineHabit.id} style={{ width: '100%', paddingBottom: 5 }}>
                <RoutineHabit routineHabit={routineHabit} onUpdateRoutineHabit={onRoutineHabitUpdated} />
            </View>
        );
    });

    return (
        <Screen>
            <ScrollView>
                <EmbtrMenuCustom />

                <Banner name={routine.id ? 'Edit Routine' : 'Create Routine'} leftText={'cancel'} leftRoute="BACK" rightText={'save'} rightOnClick={save} />
                <KeyboardAvoidingView style={{ height: '100%' }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                    <AddHabitModal
                        visible={showAddHabitsModal}
                        confirm={confirmHabits}
                        dismiss={() => {
                            setShowAddHabitsModal(false);
                        }}
                    />
                    <View style={{ paddingTop: 5 }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, fontFamily: 'Poppins_600SemiBold', fontSize: 17, paddingTop: 10, paddingLeft: 15 }}
                        >
                            Achieve your goals!
                        </Text>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.secondary_text,
                                fontFamily: 'Poppins_400Regular',
                                paddingTop: 10,
                                fontSize: 11,
                                paddingLeft: 25,
                                paddingRight: 25,
                            }}
                        >
                            define{'  '}
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    fontFamily: POPPINS_REGULAR_ITALIC,
                                }}
                            >
                                /ˈhabət/ n.{'  '}
                            </Text>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    fontFamily: POPPINS_SEMI_BOLD,
                                }}
                            >
                                1.{' '}
                            </Text>
                            a settled or regular tendency or practice, especially one that is hard to give up.
                        </Text>

                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.secondary_text,
                                fontFamily: 'Poppins_400Regular',
                                paddingTop: 10,
                                fontSize: 12,
                                paddingLeft: 15,
                                paddingRight: 15,
                            }}
                        >
                            Create a habit that pushes you to be the best version of you!
                        </Text>
                    </View>

                    {/* Name */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingTop: 15, paddingLeft: 5, width: '95%', paddingBottom: 5, fontFamily: 'Poppins_400Regular' }}
                        >
                            Routine
                        </Text>
                        <RandomPlaceHolderTextInput value={name} onChangeValue={setName} placeholderOptions={placeholderOptions} />
                    </View>

                    {/* Description */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 5, fontFamily: 'Poppins_400Regular' }}
                        >
                            Details
                        </Text>
                        <TextInput
                            textAlignVertical="top"
                            style={{
                                width: '95%',
                                fontFamily: 'Poppins_400Regular',
                                height: 100,
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
                            placeholder={'What are the details of this routine?'}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={setDetails}
                            //onChange={() => { setStoryError(false) }}
                            value={details}
                            autoCorrect={true}
                        />
                    </View>

                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', width: '95%' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.text, fontFamily: 'Poppins_400Regular', flex: 1, paddingLeft: 5 }}
                            >
                                Habits
                            </Text>

                            <Text
                                style={{ color: colors.link, textAlign: 'right', flex: 1, paddingRight: 5 }}
                                onPress={() => {
                                    setShowAddHabitsModal(true);
                                }}
                            >
                                Add Habits
                            </Text>
                        </View>
                        <View style={{ paddingTop: 5 }}>{habitViews}</View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </Screen>
    );
};
