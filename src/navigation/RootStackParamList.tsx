import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>;
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>;
    PlanTab: NavigatorScreenParams<PlanTabScreens>;
    TodayTab: undefined;
};

export type TodayTab = {
    Today: undefined;
    CreateOneTimeTask: { dayKey: string };
    PlanDay: { id: string };
    WidgetMarketplace: undefined;
    AddQuoteOfTheDay: undefined;
    UserProfile: { id: string };
};

export type PlanTabScreens = {
    PlanMain: undefined;
    CreateEditHabit: { id?: string };
    CreateOneTimeTask: { dayKey: string };
    CreateGoal: undefined;
    GoalDetails: { id: string };
    TaskDetails: { id: string };
    PlanDay: { id: string };
};

export type TimelineTabScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    CreateUserPost: undefined;
    EditUserPostDetails: { id: string };
    EditDailyResultDetails: { id: string };
    UserPostDetails: { id: string };
    ChallengeDetails: { id: string };
    DailyResultDetails: { id: string };
    UserProfile: { id: string };
    Notifications: undefined;
};

export type ProfileTabScreens = {
    Profile: undefined;
    UserSettings: undefined;
    PillarsConfiguration: undefined;
    EditUserProfile: undefined;
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
