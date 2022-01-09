import { User } from "firebase/auth";
import ProfileDao from "src/firebase/firestore/profile/ProfileDao";
import UserDao from "src/firebase/firestore/user/UserDao";
import { registerAuthStateListener } from "src/session/CurrentUserProvider";

class UserController {
    public static getAccessLevel(email: string, callback: Function) {
        const result = UserDao.getBetaRequestStatus(email);
        result.then(document => {
            if (document.exists() && document.data() && document.data()["access_level"]) {
                callback(document.data()["access_level"]);
            } else {
                const betaCreateResult = UserDao.requestBetaAccess(email);
                betaCreateResult.then(() => {
                    callback("initial_beta_pending");
                });
            }
        });
    }

    public static registerProfileUpdateListener() {
        registerAuthStateListener((user: User) => {
            if (user) {
                this.updateProfile(user);
            }
        });
    }

    private static updateProfile(user: User) {
        const name: string = user.displayName!;
        const email: string = user.email!;
        const photoUrl: string = user.photoURL!;

        ProfileDao.updateProfile({ name: name, email: email, photoUrl: photoUrl });
    }
}

export default UserController;