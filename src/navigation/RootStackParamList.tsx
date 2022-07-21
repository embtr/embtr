import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>
    PlanTab: NavigatorScreenParams<PlanTabScreens>;
    TodayTab: undefined;
}

export type TodayTab = {
    CreateTask: { dayKey?: string };
}

export type PlanTabScreens = {
    CreateOneTimeTask: { dayKey?: string };
    CreateDailyTask: undefined;
    CreateGoal: undefined;
    GoalDetails: { id: string };
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