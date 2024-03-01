import { About } from 'src/static/About';
import { Dashboard } from 'src/components/home/Dashboard';
import { Logout } from 'src/components/logout/Logout';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { AddHabitCategories } from '../plan/habit/AddHabitCategories';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { AddHabitCategory } from '../plan/habit/AddHabitCategory';
import { CreateEditScheduledHabit } from '../plan/habit/CreateEditScheduledHabit';
import { EditPlannedHabit } from '../plan/habit/EditPlannedHabit';
import { MyHabitsCategoryElement } from 'src/components/plan/habit/MyHabitsCategoryElement';
import { CreateUserPost } from 'src/components/timeline/CreateUserPost';
import { AdvancedUserSettings } from '../settings/advanced/AdvancedUserSettings';
import { UserSettings } from '../settings/main/UserSettings';
import { AddQuoteOfTheDay } from 'src/components/widgets/quote_of_the_day/AddQuoteOfTheDay';
import { NewUserProfilePopulation } from 'src/components/profile/NewUserProfilePopulation';
import { Routes } from 'src/navigation/RootStackParamList';
import { ManageHabits } from 'src/components/manage_habits/ManageHabits';
import { HabitSummaryDetails } from '../manage_habits/HabitSummaryDetails';
import { TermsApprovalModal } from 'src/components/profile/TermsApprovalModal';
import { UpdateAvailableModal } from 'src/components/modal/UpdateAvailableModal';

const Stack = createStackNavigator();

export const SecureMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Loading" component={LoadingPage} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen
                name="AddHabitCategories"
                component={AddHabitCategories}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name="AddHabitCategory" component={AddHabitCategory} />
            <Stack.Screen name="CreateEditScheduledHabit" component={CreateEditScheduledHabit} />
            <Stack.Screen name="EditPlannedHabit" component={EditPlannedHabit} />
            <Stack.Screen
                name="MyHabitsCategoryElement"
                component={MyHabitsCategoryElement}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen
                name="CreateUserPost"
                component={CreateUserPost}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name="UserSettings" component={UserSettings} />
            <Stack.Screen name="AdvancedUserSettings" component={AdvancedUserSettings} />
            <Stack.Screen
                name="AddQuoteOfTheDay"
                component={AddQuoteOfTheDay}
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
            <Stack.Screen
                name={Routes.MANAGE_HABITS}
                component={ManageHabits}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name={Routes.HABIT_SUMMARY_DETAILS} component={HabitSummaryDetails} />
        </Stack.Navigator>
    );
};
