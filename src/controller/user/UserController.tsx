import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import UserDao from 'src/firebase/firestore/user/UserDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { WIDGETS } from 'src/util/constants';

export interface UserModel {
    uid: string;
    access_level: string;
    email: string;
    post_notification_token?: string;
    today_widgets?: string[];
    timestamp: Timestamp;
    feature_versions: {
        pillar: number;
        planned_task: number;
    };
}

export const FAKE_USER: UserModel = {
    uid: '',
    access_level: '',
    email: '',
    post_notification_token: '',
    timestamp: Timestamp.now(),
    feature_versions: {
        pillar: 0,
        planned_task: 0,
    },
};

class UserController {
    public static clone(user: UserModel) {
        const clone: UserModel = {
            uid: user.uid,
            access_level: user.access_level,
            email: user.email,
            post_notification_token: user.post_notification_token,
            today_widgets: user.today_widgets,
            timestamp: user.timestamp,
            feature_versions: {
                pillar: user.feature_versions.pillar,
                planned_task: user.feature_versions.planned_task,
            },
        };

        return clone;
    }

    public static async update(user: UserModel) {
        await UserDao.update(user);
    }

    public static async get(uid: string) {
        const userData = await UserDao.get(uid);
        const currentUser: UserModel = this.getUserFromData(userData);

        return currentUser;
    }

    private static getUserFromData(data: DocumentSnapshot<DocumentData>): UserModel {
        const user: UserModel = data.data() as UserModel;
        user.uid = data.id;

        if (!user.feature_versions.pillar) {
            user.feature_versions.pillar = 0;
        }

        if (!user.feature_versions.planned_task) {
            user.feature_versions.planned_task = 0;
        }

        if (!user.today_widgets) {
            user.today_widgets = WIDGETS;
        }

        return user;
    }

    public static async getAll() {
        const results = await UserDao.getAll();
        const users: UserModel[] = [];
        results.forEach((result) => {
            let user: UserModel = this.getUserFromData(result);
            users.push(user);
        });

        return users;
    }

    public static async getCurrentUser() {
        return await this.get(getCurrentUid());
    }

    public static getAccessLevel(uid: string, email: string, callback: Function) {
        const result = UserDao.getBetaRequestStatus(uid);
        result.then((document) => {
            if (document.exists() && document.data() && document.data()['access_level']) {
                callback(document.data()['access_level']);
            } else {
                const betaCreateResult = UserDao.requestBetaAccess(uid, email);
                betaCreateResult.then(() => {
                    callback('initial_beta_pending');
                });
            }
        });
    }

    public static async updatePostNotificationToken(token: string | null) {
        await UserDao.updateField('post_notification_token', token);
    }

    public static async updateFeatureVersion(user: UserModel, feature: string, version: number) {
        if (!user.feature_versions) {
            user.feature_versions = {
                pillar: 0,
                planned_task: 0,
            };
        }

        switch (feature) {
            case 'pillar':
                user.feature_versions.pillar = version;
                break;

            case 'planned_task':
                user.feature_versions.planned_task = version;
                break;
        }

        await this.update(user);
    }
}

export default UserController;
