import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text, Alert } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PlanTabScreens, ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { StackNavigationProp } from '@react-navigation/stack';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { GoalDetailAttribute } from 'src/components/plan/goals/GoalDetailAttribute';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { format, formatDistance } from 'date-fns';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import UserController from 'src/controller/user/UserController';

export const PillarDetails = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();
    const route = useRoute<RouteProp<ProfileTabScreens, 'PillarDetails'>>();

    const [pillar, setPillar] = React.useState<PillarModel>();

    React.useEffect(() => {
        fetch();
    }, []);

    const fetch = async () => {
        const user = await UserController.get(route.params.uid);
        const pillar = await PillarController.get(user, route.params.id);
        setPillar(pillar);
    };

    const closeMenu = useAppSelector(getCloseMenu);
    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Edit',
            onPress: () => {
                if (pillar?.id) {
                    navigation.navigate('CreateEditHabit', { id: pillar?.id });
                    closeMenu();
                }
            },
        },
        {
            name: 'Archive',
            onPress: async () => {
                if (isDesktopBrowser()) {
                    if (confirm("archive task '" + pillar?.name + "'")) {
                        if (pillar) {
                            await PillarController.archive(pillar);
                        }
                        navigation.goBack();
                    }
                } else {
                    Alert.alert('Archive Task?', "Archive task '" + route.name + "'?", [
                        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                        {
                            text: 'Archive',
                            onPress: async () => {
                                if (pillar) {
                                    await PillarController.archive(pillar);
                                }
                                navigation.goBack();
                            },
                        },
                    ]);
                }
            },
        },
    ];

    if (!pillar) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const daysOld = pillar?.added ? formatDistance(pillar.added.toDate(), new Date()) : '0';

    return (
        <Screen>
            <Banner
                name={'Pillar Details'}
                leftIcon={'arrow-back'}
                leftRoute={'BACK'}
                rightIcon={'ellipsis-horizontal'}
                menuOptions={createEmbtrMenuOptions(menuItems)}
            />
            <EmbtrMenuCustom />

            <View style={{ flex: 1 }}>
                <View style={{ paddingLeft: 10 }}>
                    <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                        <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>{pillar.name}</Text>
                        <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_400Regular', opacity: 0.75, fontSize: 10, paddingTop: 3 }}></Text>
                    </View>

                    <View style={{ paddingTop: 15, marginLeft: 10, marginRight: 10 }}>
                        <HorizontalLine />
                    </View>

                    <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <GoalDetailAttribute attribute={'Created'} value={format(pillar.added.toDate(), 'MMMM dd, yyyy')} />
                            <GoalDetailAttribute attribute={'Days Old'} value={daysOld} />
                            <GoalDetailAttribute attribute={'Pillar'} value={pillar?.id ? pillar.id : 'N/A'} />
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 10 }}></View>

                        <View style={{ paddingTop: 20, width: '100%' }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font }}>History</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
