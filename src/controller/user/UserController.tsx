import { Timestamp } from 'firebase/firestore';
import CurrentUserDao from 'src/firebase/firestore/user/CurrentUserDao';
import { WIDGETS } from 'src/util/constants';

export interface UserModel {
    access_level: string;
    email: string;
    post_notification_token?: string;
    today_widgets?: string[];
    timestamp: Timestamp;
}

class UserController {
    public static clone(user: UserModel) {
        const clone: UserModel = {
            access_level: user.access_level,
            email: user.email,
            post_notification_token: user.post_notification_token,
            today_widgets: user.today_widgets,
            timestamp: user.timestamp,
        };

        return clone;
    }

    public static getAccessLevel(uid: string, email: string, callback: Function) {
        const result = CurrentUserDao.getBetaRequestStatus(uid);
        result.then((document) => {
            if (document.exists() && document.data() && document.data()['access_level']) {
                callback(document.data()['access_level']);
            } else {
                const betaCreateResult = CurrentUserDao.requestBetaAccess(uid, email);
                betaCreateResult.then(() => {
                    callback('initial_beta_pending');
                });
            }
        });
    }

    public static async getCurrentUser() {
        const userData = await CurrentUserDao.getCurrentUser();
        let currentUser: UserModel = userData.data() as UserModel;
        if (!currentUser.today_widgets) {
            currentUser.today_widgets = WIDGETS;
        }

        return currentUser;
    }

    public static async updatePostNotificationToken(token: string | null) {
        await CurrentUserDao.updateField('post_notification_token', token);
    }

    public static async update(user: UserModel) {
        await CurrentUserDao.update(user);
    }
}

export default UserController;
