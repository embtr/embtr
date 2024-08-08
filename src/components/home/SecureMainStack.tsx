import { About } from 'src/static/About';
import { Logout } from 'src/components/logout/Logout';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { AddHabitCategories } from '../plan/habit/AddHabitCategories';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { AddHabitCategory } from '../plan/habit/AddHabitCategory';
import { CreateEditScheduledHabit } from '../plan/habit/CreateEditScheduledHabit';
import { EditPlannedHabit } from '../plan/habit/EditPlannedHabit';
import { AdvancedUserSettings } from '../settings/advanced/AdvancedUserSettings';
import { UserSettings } from '../settings/main/UserSettings';
import { AddQuoteOfTheDay } from 'src/components/widgets/quote_of_the_day/AddQuoteOfTheDay';
import { NewUserProfilePopulation } from 'src/components/profile/NewUserProfilePopulation';
import { Routes } from 'src/navigation/RootStackParamList';
import { HabitSummaryDetails } from '../manage_habits/HabitSummaryDetails';
import { TermsApprovalModal } from 'src/components/profile/TermsApprovalModal';
import { UpdateAvailableModal } from 'src/components/modal/UpdateAvailableModal';
import { ManageHabits } from '../manage_habits/ManageHabits';
import { IntroModal } from '../modal/IntroModal';
import { UserNotifications } from '../settings/notifications/UserNotifications';
import { ChallengeDetailsView } from '../common/timeline/challenges/ChallengeDetailsView';
import { CreateUserPost } from '../timeline/user_post/crud/CreateUserPost';
import { CreatePlannedDayResult } from '../timeline/planned_day_result/crud/CreatePlannedDayResult';
import { EditPlannedDayResult } from '../timeline/planned_day_result/crud/EditPlannedDayResult';
import { PlannedDayResultDetails } from '../timeline/planned_day_result/PlannedDayResultDetails';
import { UserPostDetails } from '../timeline/user_post/UserPostDetails';
import { AwayMode } from '../away_mode/AwayMode';
import { HabitDetails } from '../habit/HabitDetails';
import { HabitStreakTierSummary } from '../habit_streak/HabitStreakTierSummary';
import { Dashboard } from './Dashboard';
import { LevelSummary } from '../level/LevelSummary';
import { FeatureVote } from '../feature_vote/FeatureVote';

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
            <Stack.Screen
                name={Routes.CREATE_EDIT_SCHEDULED_HABIT}
                component={CreateEditScheduledHabit}
            />
            <Stack.Screen name="EditPlannedHabit" component={EditPlannedHabit} />
            <Stack.Screen
                name={Routes.CREATE_USER_POST}
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
            <Stack.Screen name={Routes.INTRO_MODAL} component={IntroModal} />
            <Stack.Screen
                name={Routes.MANAGE_HABITS}
                component={ManageHabits}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen
                name={Routes.CREATE_EDIT_SCHEDULED_HABIT_SLIDE_UP}
                component={CreateEditScheduledHabit}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />

            <Stack.Screen
                name={Routes.CREATE_PLANNED_DAY_RESULT}
                component={CreatePlannedDayResult}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />

            <Stack.Screen name={Routes.EDIT_PLANNED_DAY_RESULT} component={EditPlannedDayResult} />
            <Stack.Screen name={Routes.HABIT_SUMMARY_DETAILS} component={HabitSummaryDetails} />
            <Stack.Screen name={Routes.USER_POST_DETAILS} component={UserPostDetails} />
            <Stack.Screen name={Routes.USER_NOTIFICATIONS} component={UserNotifications} />
            <Stack.Screen name={Routes.CHALLENGE_DETAILS_VIEW} component={ChallengeDetailsView} />
            <Stack.Screen
                name={Routes.PLANNED_DAY_RESULT_DETAILS}
                component={PlannedDayResultDetails}
            />
            <Stack.Screen name={Routes.AWAY_MODE} component={AwayMode} />
            <Stack.Screen name={Routes.HABIT_DETAILS} component={HabitDetails} />

            <Stack.Screen
                name={Routes.HABIT_STREAK_TIER_SUMMARY}
                component={HabitStreakTierSummary}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen
                name={Routes.LEVEL_SUMMARY}
                component={LevelSummary}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name={Routes.FEATURE_VOTE} component={FeatureVote} />
        </Stack.Navigator>
    );
};
