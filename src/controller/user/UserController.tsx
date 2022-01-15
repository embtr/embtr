import { User } from "firebase/auth";
import ProfileDao from "src/firebase/firestore/profile/ProfileDao";
import CurrentUserDao from "src/firebase/firestore/user/CurrentUserDao";
import { registerAuthStateListener } from "src/session/CurrentUserProvider";

class UserController {
    public static getAccessLevel(uid: string, email: string, callback: Function) {
        const result = CurrentUserDao.getBetaRequestStatus(uid);
        result.then(document => {
            if (document.exists() && document.data() && document.data()["access_level"]) {
                callback(document.data()["access_level"]);
            } else {
                const betaCreateResult = CurrentUserDao.requestBetaAccess(uid, email);
                betaCreateResult.then(() => {
                    callback("initial_beta_pending");
                });
            }
        });
    }
}

export default UserController;