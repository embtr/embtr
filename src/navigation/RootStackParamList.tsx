import { NavigatorScreenParams } from "@react-navigation/native";
import { Target } from "src/components/plan/task/CreateTask";

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>
    PlanTab: NavigatorScreenParams<PlanTabScreens>;
    TodayTab: undefined;
}

export type TodayTab = {
    CreateTask: { target: Target };
}

export type PlanTabScreens = {
    CreateTask: { target: Target };
    TaskDetails: { id: string };
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
};