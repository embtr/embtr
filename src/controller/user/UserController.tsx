import { Timestamp } from 'firebase/firestore';
import CurrentUserDao from 'src/firebase/firestore/user/CurrentUserDao';
import { WIDGETS } from 'src/util/constants';
import { VERSIONS } from 'src/util/FeatureVersions';

export interface UserModel {
    access_level: string;
    email: string;
    post_notification_token?: string;
    today_widgets?: string[];
    timestamp: Timestamp;
    feature_versions: {
        pillar: number;
    };
}

class UserController {
    public static clone(user: UserModel) {
        const clone: UserModel = {
            access_level: user.access_level,
            email: user.email,
            post_notification_token: user.post_notification_token,
            today_widgets: user.today_widgets,
            timestamp: user.timestamp,
            feature_versions: {
                pillar: user.feature_versions.pillar,
            },
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

    public static async updateFeatureVersion(user: UserModel, feature: string, version: number) {
        if (!user.feature_versions) {
            user.feature_versions = {
                pillar: VERSIONS.PILLAR,
            };
        }

        switch (feature) {
            case 'pillar':
                user.feature_versions.pillar = version;
        }

        await this.update(user);
    }
}

export default UserController;
