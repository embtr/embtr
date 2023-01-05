import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { RoutinePreview } from './RoutinePreview';
import React from 'react';
import UserController from 'src/controller/user/UserController';
import RoutineController, { RoutineModel } from 'src/controller/routine/RoutineController';

export const RoutinePreviews = () => {
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

    let habitPreviews: JSX.Element[] = [];
    for (let i = 0; i < routines.length; i++) {
        habitPreviews.push(
            <View key={i} style={{ paddingBottom: 5, width: '100%', alignItems: 'center' }}>
                <RoutinePreview routine={routines[i]} />
            </View>
        );
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', paddingBottom: 3 }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', paddingLeft: 10 }}>
                    <Text style={{ color: colors.text, fontSize: 18, fontFamily: POPPINS_SEMI_BOLD }}>Routines</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Text
                        style={{ textAlign: 'right', paddingRight: 10, color: colors.tab_selected, fontSize: 14, fontFamily: POPPINS_SEMI_BOLD }}
                        onPress={() => {
                            navigation.navigate('Routines');
                        }}
                    >
                        See all
                    </Text>
                </View>
            </View>
            <View style={{ paddingTop: 10, paddingBottom: 0 }}>{habitPreviews}</View>
        </View>
    );
};
