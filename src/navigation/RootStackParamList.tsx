import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>
    TodayTab: NavigatorScreenParams<PlanTabScreens>;
    PlanTab: undefined;
}

export type PlanTabScreens = {
    CreateRoutine: undefined;
};

export type TimelineTabScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    CreateTimelineStory: undefined;
    TimelineComments: { id: string };
    ChallengeComments: { id: string };
    UserProfile: { id: string };
    Notifications: undefined;
};

export type ProfileTabScreens = {
    Profile: undefined;
    UserSettings: undefined;
    PillarsConfiguration: undefined;
};

export type RootStackParamList = {
    LandingPage: undefined;
    Dashboard: NavigatorScreenParams<MainTabScreens>
    About: undefined;
    ReleaseNotes: undefined;
    Contact: undefined;
    Logout: undefined;
    LoadingPage: undefined;

    Goggins: undefined;
    GogginsRegister: undefined;
    GogginsSponsor: { athlete?: string };
    GogginsDonate: undefined;
};