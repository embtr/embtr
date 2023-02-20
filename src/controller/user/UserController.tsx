import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import UserDao from 'src/firebase/firestore/user/UserDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { WIDGETS } from 'src/util/constants';
import axios from 'axios';
import { CreateUserRequest, ForgotPasswordRequest, Response, VerifyEmailRequest } from 'resources/types';
import { getApiUrl } from 'src/util/UrlUtility';

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

    public static async registerUser(email: string, password: string): Promise<Response> {
        const body: CreateUserRequest = {
            email,
            password,
        };

        return await axios
            .post(getApiUrl('/user/create/'), body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async forgotPassword(email: string): Promise<Response> {
        console.log(getApiUrl('/user/forgot_password/'));
        console.log(email);
        const body: ForgotPasswordRequest = {
            email,
        };

        return await axios
            .post(getApiUrl('/user/forgot_password/'), body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async sendVerifyEmail(email: string): Promise<Response> {
        const body: VerifyEmailRequest = {
            email,
        };

        return await axios
            .post(getApiUrl('/user/send_verification_email'), body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
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

    public static async createUser(uid: string, email: string) {
        await UserDao.createUser(uid, email);
    }

    public static async updatePostNotificationToken(token: string | null) {
        await UserDao.updateField('post_notification_token', token);
    }
}

export default UserController;
