import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { GoalDetailAttribute } from 'src/components/plan/goals/GoalDetailAttribute';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { format, formatDistance } from 'date-fns';
import RoutineController, { FAKE_ROUTINE, RoutineModel } from 'src/controller/routine/RoutineController';
import RoutineHabitController, { RoutineHabitModel } from 'src/controller/routine/RoutineHabitController';
import { RoutineHabit } from './RoutineHabit';
import { ScrollView } from 'react-native-gesture-handler';

export const RoutineDetails = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'RoutineDetails'>>();

    const [routine, setRoutine] = React.useState<RoutineModel>(FAKE_ROUTINE);
    const [routineHabits, setRoutineHabits] = React.useState<RoutineHabitModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchRoutine();
        }, [])
    );

    React.useEffect(() => {
        const fetch = async () => {
            if (routine.id) {
                const routineHabits = await RoutineHabitController.getAllInRoutine(routine);
                setRoutineHabits(routineHabits);
            }
        };

        fetch();
    }, [routine]);

    const fetchRoutine = async () => {
        const routine = await RoutineController.get(route.params.id);
        setRoutine(routine);
    };

    const closeMenu = useAppSelector(getCloseMenu);
    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Edit',
            onPress: () => {
                navigation.navigate('CreateEditRoutine', { id: routine.id });
                closeMenu();
            },
        },
        {
            name: 'Archive',
            onPress: () => {},
        },
    ];

    const daysOld = formatDistance(routine.added.toDate(), new Date());
    const completedTasks = 0; // taskHistory.filter((e) => e.status === COMPLETE).length;
    const incompletedTasks = 0; //taskHistory.filter((e) => e.status === INCOMPLETE).length;
    const failedTasks = 0; //taskHistory.filter((e) => e.status === FAILED).length;

    const updateHabit = async (routineHabit: RoutineHabitModel) => {
        await RoutineHabitController.update(routineHabit);
        fetchRoutine();
    };

    const habitViews: JSX.Element[] = [];
    routineHabits.forEach((routineHabit) => {
        if (!routineHabit.active) {
            return;
        }

        habitViews.push(
            <View key={routineHabit.id} style={{ width: '100%', paddingBottom: 5, alignItems: 'center' }}>
                <RoutineHabit routineHabit={routineHabit} onUpdateRoutineHabit={updateHabit} />
            </View>
        );
    });

    return (
        <Screen>
            <Banner
                name={'Routine Details'}
                leftIcon={'arrow-back'}
                leftRoute={'BACK'}
                rightIcon={'ellipsis-horizontal'}
                menuOptions={createEmbtrMenuOptions(menuItems)}
            />
            <EmbtrMenuCustom />
            <ScrollView>
                <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>{routine.name}</Text>
                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_400Regular', opacity: 0.75, fontSize: 10, paddingTop: 3 }}>
                        {routine.description}
                    </Text>
                </View>

                <View style={{ paddingTop: 15, marginLeft: 10, marginRight: 10 }}>
                    <HorizontalLine />
                </View>

                <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <GoalDetailAttribute attribute={'Created'} value={format(routine.added.toDate(), 'MMMM dd, yyyy')} />
                        <GoalDetailAttribute attribute={'Days Old'} value={daysOld} />
                        <GoalDetailAttribute attribute={'Pillar'} value={'N/A'} />
                    </View>

                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                        <GoalDetailAttribute attribute={'Tasks Completed'} value={'0 Tasks'} />
                        <GoalDetailAttribute attribute={'Tasks Completed'} value={'0 Tasks'} />
                        <GoalDetailAttribute attribute={'Tasks Completed'} value={'0 Tasks'} />
                    </View>

                    <View style={{ paddingTop: 20 }}>
                        <Text style={{ color: colors.text, fontFamily: 'Poppins_400Regular', flex: 1, paddingLeft: 5, paddingBottom: 5 }}>Habits</Text>
                        {habitViews}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};
