import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text, Alert } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import RoutineController, { durationToString, RoutineModel, startMinuteToString } from 'src/controller/planning/TaskController';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { PlanTabScreens, RootStackParamList } from 'src/navigation/RootStackParamList';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { StackNavigationProp } from '@react-navigation/stack';

export const TaskDetails = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const leftFlex = 3;
    const rightFlex = 8;

    const route = useRoute<RouteProp<PlanTabScreens, 'TaskDetails'>>();
    const [routine, setRoutine] = React.useState<RoutineModel | undefined>();

    useFocusEffect(
        React.useCallback(() => {
            RoutineController.getRoutine(getAuth().currentUser!.uid, route.params.id, setRoutine);
        }, [])
    );

    const menuItems = [
        { text: 'Actions', isTitle: true },
        {
            text: 'Archive', onPress: () => {
                if (isDesktopBrowser()) {
                    if (confirm("archive task '" + routine?.name + "'")) {
                        if (routine) {
                            RoutineController.archiveRoutine(routine, () => { navigation.goBack() });
                        }
                    }
                } else {
                    Alert.alert("Archive Task?", "Archive task '" + route.name + "'?", [
                        { text: 'Cancel', onPress: () => { }, style: 'cancel', },
                        {
                            text: 'Archive', onPress: () => {
                                if (routine) {
                                    RoutineController.archiveRoutine(routine, () => { navigation.goBack() });
                                }
                            }
                        },
                    ]);
                }
            }
        }
        //{ text: 'Action 2', withSeparator: true, onPress: () => { } },
        //{ text: 'Action 3', isDestructive: true, onPress: () => { } },
    ];

    return (
        <Screen>
            <Banner name={"Task Details"} leftIcon={"arrow-back"} leftRoute={"BACK"} rightIcon={"ellipsis-horizontal"} menuItems={menuItems} />

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

                <View style={{ flex: 1 }} />
            </View>
        </Screen>
    );
};