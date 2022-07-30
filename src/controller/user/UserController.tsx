import { Timestamp } from "firebase/firestore";
import CurrentUserDao from "src/firebase/firestore/user/CurrentUserDao";

export interface UserModel {
    access_level: string,
    email: string,
    post_notification_token?: string,
    timestamp: Timestamp
}

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

    public static updatePostNotificationToken(token: string, callback: Function) {
        const result = CurrentUserDao.updateField("post_notification_token", token);
        result.then(() => { callback(
        ) });
    }
}

export default UserController;