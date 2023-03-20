import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>;
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>;
    PlanTab: NavigatorScreenParams<PlanTabScreens>;
    TodayTab: undefined;
};

export type TodayTab = {
    Today: undefined;
    CreateEditOneTimeTask: { dayKey: string; id: string };
    PlanDay: { id: string };
    WidgetMarketplace: undefined;
    AddQuoteOfTheDay: undefined;
    UserProfile: { id: string };
};

export type PlanTabScreens = {
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
};

export type TimelineTabScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    CreateUserPost: undefined;
    EditUserPostDetails: { id: string };
    EditDailyResultDetails: { id: number };
    UserPostDetails: { id: string };
    ChallengeDetails: { id: string };
    DailyResultDetails: { id: number };
    UserProfile: { id: string };
    Notifications: undefined;
    PillarDetails: { uid: string; id: string };
    ViewAllComments: { uid: string; goalId: string };
    GoalDetails: { uid: string; id: string; source: string };
};

export type ProfileTabScreens = {
    Profile: undefined;
    UserSettings: undefined;
    CreateEditPillar: undefined;
    PillarDetails: { uid: string; id: string };
    EditUserProfile: undefined;
    GoalDetails: { uid: string; id: string; source: string };
    UserPostDetails: { id: string };
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
