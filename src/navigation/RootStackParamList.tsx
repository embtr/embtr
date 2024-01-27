import { NavigatorScreenParams } from '@react-navigation/native';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { HabitCategoryType } from 'src/util/habit_category/HabitCategoryUtility';
import { QueryKey } from '@tanstack/react-query';

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>;
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>;
    PlanTab: NavigatorScreenParams<ChallengeTabScreens>;
    TodayTab: undefined;
};

export type MasterScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    CreateUserPost: undefined;
    EditUserPostDetails: { id: number };
    EditDailyResultDetails: { id: number };
    UserPostDetails: { id: number };
    DailyResultDetails: { id: number };
    UserProfile: { id: string };
    Notifications: undefined;
    PillarDetails: { uid: string; id: string };
    ViewAllComments: { uid: string; goalId: string };
    GoalDetails: { uid: string; id: string; source: string };
    UserPosts: { userId: number };
    DailyResults: { userId: number };
    ChallengeDetails: { id: number };
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
    ManageHabits: undefined;
    HabitSummaryDetails: { id: number };
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
};

export type TimelineTabScreens = MasterScreens & {};

export type TodayTab = MasterScreens & {};

export type ChallengeTabScreens = MasterScreens & {};

export type ProfileTabScreens = MasterScreens & {};

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
    export const EDIT_USER_POST_DETAILS = 'EditUserPostDetails';
    export const USER_POST_DETAILS = 'UserPostDetails';
    export const CREATE_USER_POST = 'CreateUserPost';
    export const DAILY_RESULT_DETAILS = 'DailyResultDetails';
    export const ADD_HABIT_CATEGORY = 'AddHabitCategory';
    export const ADD_HABIT_CATEGORIES = 'AddHabitCategories';
    export const CREATE_EDIT_SCHEDULED_HABIT = 'CreateEditScheduledHabit';
    export const EDIT_PLANNED_HABIT = 'EditPlannedHabit';
    export const MY_HABITS_CATEGORY_ELEMENT = 'MyHabitsCategoryElement';
    export const ADVANCED_USER_SETTINGS = 'AdvancedUserSettings';
    export const NEW_USER_PROFILE_POPULATION = 'NewUserProfilePopulation';
    export const TERMS_APPROVAL_MODAL = 'TermsApprovalModal';
    export const UPDATE_AVAILABLE_MODAL = 'UpdateAvailableModal';
    export const MANAGE_HABITS = 'ManageHabits';
    export const HABIT_SUMMARY_DETAILS = 'HabitSummaryDetails';
    export const LOGIN_MODAL = 'LoginModal';
    export const REGISTER_MODAL = 'RegisterModal';
}
