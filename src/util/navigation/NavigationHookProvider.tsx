import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens, TimelineTabScreens, TodayTab, ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { TABS } from 'src/components/home/Dashboard';

export const getNavigationHook = (currentTab: string) => {
    if (currentTab === TABS.TIMELINE) {
        return useNavigation<StackNavigationProp<TimelineTabScreens>>;
    }

    if (currentTab === TABS.TODAY) {
        return useNavigation<StackNavigationProp<TodayTab>>;
    }

    if (currentTab === TABS.PLAN) {
        return useNavigation<StackNavigationProp<PlanTabScreens>>;
    }

    if (currentTab === TABS.USER_PROFILE) {
        return useNavigation<StackNavigationProp<ProfileTabScreens>>;
    }

    return useNavigation<StackNavigationProp<TimelineTabScreens>>;
};
