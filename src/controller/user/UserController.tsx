import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import UserDao from 'src/firebase/firestore/user/UserDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { WIDGETS } from 'src/util/constants';
import { getAuth } from 'firebase/auth';
import axiosInstance from 'src/axios/axios';
import { CreateAccountRequest, ForgotAccountPasswordRequest, VerifyAccountEmailRequest } from 'resources/types/AccountTypes';
import { GetUserResponse } from 'resources/types/UserTypes';
import { Response } from 'resources/types/RequestTypes';

export interface UserModel {
    uid: string;
    access_level: string;
    email: string;
    post_notification_token?: string;
    today_widgets?: string[];
    timestamp: Timestamp;
}

export const FAKE_USER: UserModel = {
    uid: '',
    access_level: '',
    email: '',
    post_notification_token: '',
    timestamp: Timestamp.now(),
};

const ACCOUNT_ENDPOINT = 'account';
const USER_ENDPOINT = 'user';

class UserController {
    public static clone(user: UserModel) {
        const clone: UserModel = {
            uid: user.uid,
            access_level: user.access_level,
            email: user.email,
            post_notification_token: user.post_notification_token,
            today_widgets: user.today_widgets,
            timestamp: user.timestamp,
        };

        return clone;
    }

    public static async createAccount(email: string, password: string): Promise<Response> {
        const body: CreateAccountRequest = {
            email,
            password,
        };

        return await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/create/`, body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async forgotPassword(email: string): Promise<Response> {
        const body: ForgotAccountPasswordRequest = {
            email,
        };

        return await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/forgot_password/`, body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async sendVerifyEmail(email: string): Promise<Response> {
        const body: VerifyAccountEmailRequest = {
            email,
        };

        return await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/send_verification_email`, body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async getUserViaApi(uid: string): Promise<GetUserResponse> {
        return await axiosInstance
            .get(`/${USER_ENDPOINT}/${uid}`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async createUser() {
        return await axiosInstance
            .post(`/${USER_ENDPOINT}/`)
            .then(async (success) => {
                this.forceRefreshIdToken();
                return success.data;
            })
            .catch((error) => {
                getAuth().currentUser?.getIdToken(true);
                return error.response.data;
            });
    }

    public static async createUserIfNew(uid: string) {
        const userResponse: GetUserResponse = await this.getUserViaApi(uid);
        if (userResponse.success) {
            return;
        }

        await this.createUser();
    }

    public static async get(uid: string) {
        const user = await this.getFromNewSystem(uid);
        if (user) {
            return user;
        }

        return await this.getFromOldSystem(uid);
    }

    public static async getFromNewSystem(uid: string): Promise<UserModel | null> {
        const userResponse: GetUserResponse = await this.getUserViaApi(uid);
        if (userResponse.success && userResponse.user) {
            const user: UserModel = {
                uid: userResponse.user.uid!,
                email: userResponse.user.email!,
                access_level: '',
                post_notification_token: '',
                today_widgets: WIDGETS,
                timestamp: Timestamp.now(),
            };

            return user;
        }

        return null;
    }

    private static async forceRefreshIdToken() {
        await getAuth().currentUser?.getIdToken(true);
    }

    /*
     * ============= OLD SYSTEM LOGIC ==============
     */

    public static async update(user: UserModel) {
        await UserDao.update(user);
    }

    public static async getFromOldSystem(uid: string): Promise<UserModel | null> {
        const userData = await UserDao.get(uid);
        const user: UserModel = this.getUserFromData(userData);

        return user;
    }

    private static getUserFromData(data: DocumentSnapshot<DocumentData>): UserModel {
        const user: UserModel = data.data() as UserModel;
        user.uid = data.id;

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

    public static async updatePostNotificationToken(token: string | null) {
        await UserDao.updateField('post_notification_token', token);
    }
}

export default UserController;
