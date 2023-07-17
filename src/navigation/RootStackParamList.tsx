import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>;
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>;
    PlanTab: NavigatorScreenParams<ChallengeTabScreens>;
    TodayTab: undefined;
};

export type TimelineTabScreens = {
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
};

export type TodayTab = {
    Today: undefined;
    CreateEditOneTimeTask: { dayKey: string; id: string };
    PlanDay: { id: string };
    WidgetMarketplace: undefined;
    AddQuoteOfTheDay: undefined;
    DailyResultDetails: { id: number };
    UserProfile: { id: string };
};

export type ChallengeTabScreens = {
    PlanMain: undefined;
    PlanPreviews: undefined;
    Habits: undefined;
    Planning: undefined;
    Routines: undefined;
    CreateEditHabit: { id?: string };
    CreateEditOneTimeTask: { dayKey: string; id?: string };
    CreateEditGoal: { id?: string };
    CreateEditRoutine: { id?: string };
    GoalDetails: { uid: string; id: string; source: string };
    Goals: undefined;
    TaskDetails: { id: string };
    PlanDay: { id: string };
    Pillars: undefined;
    CreateEditPillar: undefined;
    PillarDetails: { uid: string; id: string };
    RoutineDetails: { id: string };
    ViewAllComments: { uid: string; goalId: string };
    DailyResultDetails: { id: number };
    ChallengeDetails: { id: number };
};

export type ProfileTabScreens = {
    Profile: undefined;
    UserSettings: undefined;
    CreateEditPillar: undefined;
    PillarDetails: { uid: string; id: string };
    EditUserProfile: undefined;
    GoalDetails: { uid: string; id: string; source: string };
    UserPostDetails: { id: number };
    UserPosts: { userId: number };
    DailyResults: { userId: number };
};

export type RootStackParamList = {
    LandingPage: undefined;
    Dashboard: NavigatorScreenParams<MainTabScreens>;
    About: undefined;
    ReleaseNotes: undefined;
    Contact: undefined;
    Logout: undefined;
    LoadingPage: undefined;
};
