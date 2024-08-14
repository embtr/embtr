import { NavigatorScreenParams } from '@react-navigation/native';
import { NewPlannedHabitData } from 'src/model/PlannedHabitModels';
import { HabitCategoryType } from 'src/util/habit_category/HabitCategoryUtility';

export type MainTabScreens = {
    TimelineTab: NavigatorScreenParams<TimelineTabScreens>;
    CurrentUserTab: NavigatorScreenParams<ProfileTabScreens>;
    JourneyTab: NavigatorScreenParams<JourneyTabScreens>;
    PlanTab: NavigatorScreenParams<ChallengeTabScreens>;
    TodayTab: undefined;
};

export type TutorialIslandTabScreens = {
    TutorialIslandTimelineTab: NavigatorScreenParams<TutorialIslandTimelineTabScreens>;
    TutorialIslandCurrentUserTab: NavigatorScreenParams<TutorialIslandProfileTabScreens>;
    TutorialIslandJourneyTab: NavigatorScreenParams<TutorialIslandJourneyTabScreens>;
    TutorialIslandPlanTab: NavigatorScreenParams<TutorialIslandChallengeTabScreens>;
    TutorialIslandTodayTab: NavigatorScreenParams<TutorialIslandTodayTab>;
    TutorialIslandCreateEditScheduledHabitSlideUp: NavigatorScreenParams<TutorialIslandTodayTab>;
};

export type TutorialIslandScreens = {
    TutorialIslandCreateEditScheduledHabit: {
        onExit?: () => void;
        habitId?: number;
        isCreateCustomHabit?: boolean;
        scheduledHabitId?: number;
    };
    NewUserProfilePopulation: undefined;
    TermsApprovalModal: undefined;
    UpdateAvailableModal: undefined;
    IntroModal: undefined;
};

export type TutorialIslandTimelineTabScreens = TutorialIslandScreens & {};

export type TutorialIslandTodayTab = TutorialIslandScreens & {};

export type TutorialIslandChallengeTabScreens = TutorialIslandScreens & {};

export type TutorialIslandProfileTabScreens = TutorialIslandScreens & {};

export type TutorialIslandJourneyTabScreens = TutorialIslandScreens & {};

export type MasterScreens = {
    UserSearch: undefined;
    Timeline: undefined;
    UserProfile: { id: string };
    Notifications: undefined;
    PillarDetails: { uid: string; id: string };
    ViewAllComments: { uid: string; goalId: string };
    GoalDetails: { uid: string; id: string; source: string };
    UserPosts: { userId: number };
    ChallengeDetailsView: { id: number };
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
    AdvancedUserSettings: undefined;
    EditUserProfile: undefined;
    AddHabitCategories: undefined;
    AddHabitCategory: { id?: number; type?: HabitCategoryType };
    MyHabitsCategoryElement: undefined;
    NewUserProfilePopulation: undefined;
    TermsApprovalModal: undefined;
    UpdateAvailableModal: undefined;
    IntroModal: undefined;
    ManageHabits: undefined;
    HabitSummaryDetails: { id: number };
    Journey: undefined;
    UserNotifications: undefined;
    CreatePlannedDayResult: { dayKey: string };
    EditPlannedDayResult: { id: number };
    CreateUserPost: undefined;
    EditUserPost: { id: number };
    UserPostDetails: { id: number };
    FeaturedPostDetails: { id: number };
    PlannedDayResultDetails: { id: number };
    FeatureVote: undefined;

    CreateEditScheduledHabit_SlideUp: {
        onExit?: () => void;
        habitId?: number;
        isCreateCustomHabit?: boolean;
        scheduledHabitId?: number;
    };
    CreateEditScheduledHabit: {
        onExit?: () => void;
        habitId?: number;
        isCreateCustomHabit?: boolean;
        scheduledHabitId?: number;
    };

    EditPlannedHabit: {
        plannedTaskId?: number;
        newPlannedHabitData?: NewPlannedHabitData;
    };
    LoginModal: { newAccountEmail?: string } | undefined;
    RegisterModal: undefined;
    AwayMode: undefined;
    HabitDetails: { id: number };
    HabitStreakTierSummary: undefined;
    LevelSummary: undefined;
};

export type TimelineTabScreens = MasterScreens & {};

export type TodayTab = MasterScreens & {};

export type ChallengeTabScreens = MasterScreens & {};

export type ProfileTabScreens = MasterScreens & {};

export type JourneyTabScreens = MasterScreens & {};

export type RootStackParamList = {
    LandingPage: undefined;
    Dashboard: NavigatorScreenParams<MainTabScreens>;
    TutorialIslandDashboard: NavigatorScreenParams<TutorialIslandTabScreens>;
    About: undefined;
    ReleaseNotes: undefined;
    Contact: undefined;
    Logout: undefined;
    LoadingPage: undefined;
    Loading: undefined;
};

export namespace Routes {
    export const GOALS: keyof MasterScreens = 'Goals';
    export const CREATE_USER_POST = 'CreateUserPost';
    export const EDIT_USER_POST = 'EditUserPost';
    export const USER_POST_DETAILS = 'UserPostDetails';
    export const FEATURED_POST_DETAILS = 'FeaturedPostDetails';
    export const ADD_HABIT_CATEGORY = 'AddHabitCategory';
    export const ADD_HABIT_CATEGORIES = 'AddHabitCategories';
    export const CREATE_EDIT_SCHEDULED_HABIT = 'CreateEditScheduledHabit';
    export const CREATE_EDIT_SCHEDULED_HABIT_SLIDE_UP = 'CreateEditScheduledHabit_SlideUp';
    export const EDIT_PLANNED_HABIT = 'EditPlannedHabit';
    export const ADVANCED_USER_SETTINGS = 'AdvancedUserSettings';
    export const NEW_USER_PROFILE_POPULATION = 'NewUserProfilePopulation';
    export const TERMS_APPROVAL_MODAL = 'TermsApprovalModal';
    export const UPDATE_AVAILABLE_MODAL = 'UpdateAvailableModal';
    export const INTRO_MODAL = 'IntroModal';
    export const MANAGE_HABITS = 'ManageHabits';
    export const HABIT_SUMMARY_DETAILS = 'HabitSummaryDetails';
    export const LOGIN_MODAL = 'LoginModal';
    export const REGISTER_MODAL = 'RegisterModal';
    export const JOURNEY = 'Journey';
    export const USER_NOTIFICATIONS = 'UserNotifications';
    export const CHALLENGE_DETAILS_VIEW = 'ChallengeDetailsView';
    export const CREATE_PLANNED_DAY_RESULT = 'CreatePlannedDayResult';
    export const EDIT_PLANNED_DAY_RESULT = 'EditPlannedDayResult';
    export const PLANNED_DAY_RESULT_DETAILS = 'PlannedDayResultDetails';
    export const AWAY_MODE = 'AwayMode';
    export const HABIT_DETAILS = 'HabitDetails';
    export const HABIT_STREAK_TIER_SUMMARY = 'HabitStreakTierSummary';
    export const LEVEL_SUMMARY = 'LevelSummary';
    export const FEATURE_VOTE = 'FeatureVote';
}

export namespace TutorialIslandRoutes {
    export const TUTORIAL_ISLAND_TIMELINE = 'TutorialIslandTimeline';
    export const TUTORIAL_ISLAND_CURRENT_USER = 'TutorialIslandCurrentUser';
    export const TUTORIAL_ISLAND_JOURNEY = 'TutorialIslandJourney';
    export const TUTORIAL_ISLAND_PLAN = 'TutorialIslandPlan';
    export const TUTORIAL_ISLAND_TODAY = 'TutorialIslandToday';

    export const TUTORIAL_ISLAND_DASHBOARD = 'TutorialIslandDashboard';
    export const TUTORIAL_ISLAND_MY_HABITS_TAB = 'TutorialIslandMyHabitsTab';
    export const TUTORIAL_ISLAND_CREATE_EDIT_SCHEDULED_HABIT =
        'TutorialIslandCreateEditScheduledHabit';
}
