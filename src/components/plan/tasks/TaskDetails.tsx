import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import RoutineController, { durationToString, RoutineModel, startMinuteToString } from 'src/controller/planning/RoutineController';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';

export const TaskDetails = () => {
    const { colors } = useTheme();

    const leftFlex = 3;
    const rightFlex = 8;

    const route = useRoute<RouteProp<PlanTabScreens, 'TaskDetails'>>();
    const [routine, setRoutine] = React.useState<RoutineModel | undefined>();

    useFocusEffect(
        React.useCallback(() => {
            RoutineController.getRoutine(getAuth().currentUser!.uid, route.params.id, setRoutine);
        }, [])
    );

    const onRetire = () => {

    };

    return (
        <Screen>
            <Banner name={"Task Details"} leftIcon={"arrow-back"} leftRoute={"BACK"} />

            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 10, alignItems: "center" }}>
                        <Text style={{ color: colors.text, fontSize: 20 }}>
                            {routine?.name}
                        </Text>
                    </View>
                </View>


                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: colors.text, flex: leftFlex, textAlign: "right" }}>
                            created:
                        </Text>
                        <Text style={{ color: colors.text, flex: rightFlex, paddingLeft: 10 }}>
                            {routine?.added.toDate().toString()}
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: colors.text, flex: leftFlex, textAlign: "right" }}>
                            completed:
                        </Text>
                        <Text style={{ color: colors.text, flex: rightFlex, paddingLeft: 10 }}>
                            12/13 (92.30%)
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: colors.text, flex: leftFlex, textAlign: "right" }}>
                            longest streak:
                        </Text>
                        <Text style={{ color: colors.text, flex: rightFlex, paddingLeft: 10 }}>
                            3 routines
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: colors.text, flex: leftFlex, textAlign: "right" }}>
                            start time:
                        </Text>
                        <Text style={{ color: colors.text, flex: rightFlex, paddingLeft: 10 }}>
                            {routine?.startMinute && startMinuteToString(routine!.startMinute)}
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: colors.text, flex: leftFlex, textAlign: "right" }}>
                            duration:
                        </Text>
                        <Text style={{ color: colors.text, flex: rightFlex, paddingLeft: 10 }}>
                            {routine?.duration && durationToString(routine!.duration)}
                        </Text>
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 10, flexDirection: "row", alignItems: "flex-end" }}>
                        <View style={{ flex: 1 }} />
                        <View style={{ flex: 2, alignItems: "center" }}>
                            <EmbtrButton buttonText={"Copy"} size="small" callback={() => { }} />
                        </View>

                        <View style={{ flex: 2, alignItems: "center" }}>
                            <EmbtrButton buttonText={"Retire"} size="small" callback={() => { }} />
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
            </View>
        </Screen>
    );
};