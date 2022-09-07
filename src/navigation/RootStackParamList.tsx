import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>
    PlanTab: NavigatorScreenParams<PlanTabScreens>;
    TodayTab: undefined;
}

export type TodayTab = {
    CreateOneTimeTask: { dayKey: string };
    EditOneTimeTask: {dayKey: string, plannedTaskId: string}
}

export type PlanTabScreens = {
    CreateOneTimeTask: { dayKey: string };
    CreateDailyTask: undefined;
    CreateGoal: undefined;
    GoalDetails: { id: string };
    TaskDetails: { id: string };

};

export type TimelineTabScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    CreateTimelineStory: undefined;
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
    Dashboard: NavigatorScreenParams<MainTabScreens>
    About: undefined;
    ReleaseNotes: undefined;
    Contact: undefined;
    Logout: undefined;
    LoadingPage: undefined;
};
