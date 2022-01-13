import { NavigatorScreenParams } from "@react-navigation/native";

export type TimelineTabScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    UserProfile: { id: string };
};

export type ProfileTabScreens = {
    Profile: undefined;
    UserSettings: undefined;
};

export type MainTabScreens = {
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>
}

export type RootStackParamList = {
    LandingPage: undefined;
    Dashboard: NavigatorScreenParams<MainTabScreens>
    About: undefined;
    ReleaseNotes: undefined;
    Contact: undefined;
    Logout: undefined;
};