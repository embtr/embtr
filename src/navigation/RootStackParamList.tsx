import { NavigatorScreenParams } from '@react-navigation/native';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { HabitCategoryType } from 'src/util/habit_category/HabitCategoryUtility';

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>;
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>;
    JourneyTab: NavigatorScreenParams<JourneyTabScreens>;
    PlanTab: NavigatorScreenParams<ChallengeTabScreens>;
    TodayTab: undefined;
};

export type MasterScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    UserProfile: { id: string };
    Notifications: undefined;
    PillarDetails: { uid: string; id: string };
    ViewAllComments: { uid: string; goalId: string };
    GoalDetails: { uid: string; id: string; source: string };
    UserPosts: { userId: number };
    ChallengeDetailsView: { id: number };
    Today: undefined;
    PlanDay: { id: string };
    WidgetMarketplace: undefined;
    AddQuoteOfTheDay: undefined;
    Habits: undefined;
    Planning: undefined;
    Routines: undefined;
    CreateEditHabit: { id?: string };
    CreateEditOneTimeTask: { dayKey: string; id?: string };
    CreateEditGoal: { id?: string };
    CreateEditRoutine: { id?: string };
    TaskDetails: { id: string };
    Goals: undefined;
    Pillars: undefined;
    RoutineDetails: { id: string };
    Profile: undefined;
    UserSettings: undefined;
    AdvancedUserSettings: undefined;
    EditUserProfile: undefined;
    AddHabitCategories: undefined;
    AddHabitCategory: { id?: number; type?: HabitCategoryType };
    MyHabitsCategoryElement: undefined;
    NewUserProfilePopulation: undefined;
    TermsApprovalModal: undefined;
    UpdateAvailableModal: undefined;
    IntroModal: undefined;
    ManageHabits: undefined;
    HabitSummaryDetails: { id: number };
    Journey: undefined;
    UserNotifications: undefined;
    CreatePlannedDayResult: { dayKey: string };
    EditPlannedDayResult: { id: number };
    CreateUserPost: undefined;
    EditUserPost: { id: number };
    UserPostDetails: { id: number };
    PlannedDayResultDetails: { id: number };

    CreateEditScheduledHabit_SlideUp: {
        onExit?: () => void;
        habitId?: number;
        isCreateCustomHabit?: boolean;
        scheduledHabitId?: number;
    };
    CreateEditScheduledHabit: {
        onExit?: () => void;
        habitId?: number;
        isCreateCustomHabit?: boolean;
        scheduledHabitId?: number;
    };

    EditPlannedHabit: {
        plannedTaskId?: number;
        newPlannedHabitData?: NewPlannedHabitData;
    };
    LoginModal: { newAccountEmail?: string } | undefined;
    RegisterModal: undefined;
    AwayMode: undefined;
};

export type TimelineTabScreens = MasterScreens & {};

export type TodayTab = MasterScreens & {};

export type ChallengeTabScreens = MasterScreens & {};

export type ProfileTabScreens = MasterScreens & {};

export type JourneyTabScreens = MasterScreens & {};

export type RootStackParamList = {
    LandingPage: undefined;
    Dashboard: NavigatorScreenParams<MainTabScreens>;
    About: undefined;
    ReleaseNotes: undefined;
    Contact: undefined;
    Logout: undefined;
    LoadingPage: undefined;
    Loading: undefined;
};

export namespace Routes {
    export const GOALS: keyof MasterScreens = 'Goals';
    export const CREATE_USER_POST = 'CreateUserPost';
    export const EDIT_USER_POST = 'EditUserPost';
    export const USER_POST_DETAILS = 'UserPostDetails';
    export const ADD_HABIT_CATEGORY = 'AddHabitCategory';
    export const ADD_HABIT_CATEGORIES = 'AddHabitCategories';
    export const CREATE_EDIT_SCHEDULED_HABIT = 'CreateEditScheduledHabit';
    export const CREATE_EDIT_SCHEDULED_HABIT_SLIDE_UP = 'CreateEditScheduledHabit_SlideUp';
    export const EDIT_PLANNED_HABIT = 'EditPlannedHabit';
    export const ADVANCED_USER_SETTINGS = 'AdvancedUserSettings';
    export const NEW_USER_PROFILE_POPULATION = 'NewUserProfilePopulation';
    export const TERMS_APPROVAL_MODAL = 'TermsApprovalModal';
    export const UPDATE_AVAILABLE_MODAL = 'UpdateAvailableModal';
    export const INTRO_MODAL = 'IntroModal';
    export const MANAGE_HABITS = 'ManageHabits';
    export const HABIT_SUMMARY_DETAILS = 'HabitSummaryDetails';
    export const LOGIN_MODAL = 'LoginModal';
    export const REGISTER_MODAL = 'RegisterModal';
    export const JOURNEY = 'Journey';
    export const USER_NOTIFICATIONS = 'UserNotifications';
    export const CHALLENGE_DETAILS_VIEW = 'ChallengeDetailsView';
    export const CREATE_PLANNED_DAY_RESULT = 'CreatePlannedDayResult';
    export const EDIT_PLANNED_DAY_RESULT = 'EditPlannedDayResult';
    export const PLANNED_DAY_RESULT_DETAILS = 'PlannedDayResultDetails';
    export const AWAY_MODE = 'AwayMode';
}
