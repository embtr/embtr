import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { TutorialIslandDashboard } from '../tutorial/TutorialIslandDashboard';
import { Routes, TutorialIslandRoutes } from 'src/navigation/RootStackParamList';
import { TutorialIslandCreateEditScheduledHabit } from '../tutorial/TutorialIslandCreateEditScheduledHabit';
import { NewUserProfilePopulation } from '../profile/NewUserProfilePopulation';
import { TermsApprovalModal } from '../profile/TermsApprovalModal';
import { UpdateAvailableModal } from '../modal/UpdateAvailableModal';
import { IntroModal } from '../modal/IntroModal';

const Stack = createStackNavigator();

export const TutorialIslandSecureMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={TutorialIslandRoutes.TUTORIAL_ISLAND_DASHBOARD}
                component={TutorialIslandDashboard}
            />
            <Stack.Screen
                name={TutorialIslandRoutes.TUTORIAL_ISLAND_CREATE_EDIT_SCHEDULED_HABIT}
                component={TutorialIslandCreateEditScheduledHabit}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />

            <Stack.Screen
                name={Routes.NEW_USER_PROFILE_POPULATION}
                component={NewUserProfilePopulation}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen
                name={Routes.TERMS_APPROVAL_MODAL}
                component={TermsApprovalModal}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen
                name={Routes.UPDATE_AVAILABLE_MODAL}
                component={UpdateAvailableModal}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name={Routes.INTRO_MODAL} component={IntroModal} />
        </Stack.Navigator>
    );
};
