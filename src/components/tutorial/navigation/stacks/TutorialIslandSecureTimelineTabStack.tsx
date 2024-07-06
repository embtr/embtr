import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { TutorialIslandTimeline } from '../../TutorialIslandTimeline';
import { Routes, TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { NewUserProfilePopulation } from 'src/components/profile/NewUserProfilePopulation';
import { TermsApprovalModal } from 'src/components/profile/TermsApprovalModal';
import { UpdateAvailableModal } from 'src/components/modal/UpdateAvailableModal';

const Stack = createStackNavigator();

export const TutorialIslandSecureTimelineTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={TutorialIslandRoutes.TUTORIAL_ISLAND_TIMELINE}
                component={TutorialIslandTimeline}
            />
        </Stack.Navigator>
    );
};
