import { User } from "firebase/auth";
import ProfileDao, { UserProfileModel } from "src/firebase/firestore/profile/ProfileDao";
import { registerAuthStateListener } from "src/session/CurrentUserProvider";

class ProfileController {
    public static getProfile(uid: string, callback: Function) {
        const result = ProfileDao.getProfile(uid);
        result.then(document => {
            if (document.exists()) {
                callback(document.data());
            } else {
                callback(undefined);
            }
        });
    }

    public static registerInitialProfileUpdateListener() {
        registerAuthStateListener((user: User) => {
            if (user) {
                this.getProfile(user.uid, (profileData: UserProfileModel) => {
                    if (!profileData) {
                        this.setInitialProfile(user);
                    }
                });
            }
        });
    }

    private static setInitialProfile(user: User) {
        const uid: string = user.uid;
        const name: string = user.displayName!;
        const nameLower: string = user.displayName!.toLowerCase()
        const email: string = user.email!;
        const photoUrl: string = user.photoURL!;

        ProfileDao.updateProfile({ uid: uid, name: name, nameLower: nameLower, email: email, photoUrl: photoUrl });
    }

    public static updateProfile(userProfile: UserProfileModel) {
        ProfileDao.updateProfile(userProfile);
    }
}

export default ProfileController;