import { NavigatorScreenParams } from '@react-navigation/native';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';

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
    EditUserProfile: undefined;
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

    // in-app screens without tab bar
    AddHabitCategory: { id: number, isCustomHabits?: boolean };
    AddHabitCategories: undefined;
    CreateEditScheduledHabit: {
        habitId?: number;
        isCreateCustomHabit?: boolean;
        scheduledHabitId?: number;
    };

    EditPlannedHabit: {
        plannedTaskId?: number;
        newPlannedHabitData?: NewPlannedHabitData;
    };
};

export namespace Routes {
    export const ADD_HABIT_CATEGORY = 'AddHabitCategory';
    export const ADD_HABIT_CATEGORIES = 'AddHabitCategories';
    export const CREATE_EDIT_SCHEDULED_HABIT = 'CreateEditScheduledHabit';
    export const EDIT_PLANNED_HABIT = 'EditPlannedHabit';
}
