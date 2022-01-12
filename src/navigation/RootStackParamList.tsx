import { UserProfileModel } from "src/firebase/firestore/profile/ProfileDao";

export type RootStackParamList = {
    LandingPage: undefined;
    Dashboard: undefined;
    About: undefined;
    ReleaseNotes: undefined;
    Contact: undefined;
    UserSettings: undefined;
    UserSearch: undefined;
    UserProfile: { id: string };
};