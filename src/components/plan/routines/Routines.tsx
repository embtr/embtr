import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import React from 'react';
import RoutineController, { RoutineModel } from 'src/controller/routine/RoutineController';
import UserController from 'src/controller/user/UserController';
import { RoutineElement } from './RoutineElement';

export const Routines = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [routines, setRoutines] = React.useState<RoutineModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchRoutines();
        }, [])
    );

    const fetchRoutines = async () => {
        const user = await UserController.getCurrentUser();
        const routines = await RoutineController.getAll(user);
        setRoutines(routines);
    };

    let taskViews: JSX.Element[] = [];
    routines.forEach((routine) => {
        taskViews.push(
            <View key={routine.id} style={{ paddingBottom: 5, width: '100%', alignItems: 'center' }}>
                <RoutineElement routine={routine} />
            </View>
        );
    });

    return (
        <Screen>
            <View style={{ height: '100%' }}>
                <Banner
                    name={'Routines'}
                    leftText={'back'}
                    leftRoute="BACK"
                    rightIcon={'add'}
                    rightOnClick={() => {
                        navigation.navigate('CreateEditRoutine', { id: undefined });
                    }}
                />
                <ScrollView style={{ backgroundColor: colors.background, paddingTop: 7 }}>{taskViews}</ScrollView>
            </View>
        </Screen>
    );
};
