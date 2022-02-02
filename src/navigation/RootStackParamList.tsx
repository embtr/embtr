import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>
    ExploreTab: NavigatorScreenParams<ExploreTabScreens>
}

export type TimelineTabScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    CreateTimelineStory: undefined;
    UserProfile: { id: string };
};

export type ProfileTabScreens = {
    Profile: undefined;
    UserSettings: undefined;
    PillarsConfiguration: undefined;
};

export type ExploreTabScreens = {
    Explore: undefined;
    ChallengeComments: { id: string };
}

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