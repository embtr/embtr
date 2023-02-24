import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import UserDao from 'src/firebase/firestore/user/UserDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { WIDGETS } from 'src/util/constants';
import axios from 'axios';
import { getApiUrl } from 'src/util/UrlUtility';
import { Response, CreateAccountRequest, ForgotAccountPasswordRequest, VerifyAccountEmailRequest, GetUserResponse } from 'resources/types';
import { USER } from 'resources/endpoints';
import { getAuth } from 'firebase/auth';
import { getAuthTokenId } from 'src/util/user/CurrentUserUtil';

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

        return await axios
            .post(getApiUrl(`/${ACCOUNT_ENDPOINT}/create/`), body)
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

        return await axios
            .post(getApiUrl(`/${ACCOUNT_ENDPOINT}/forgot_password/`), body)
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

        return await axios
            .post(getApiUrl(`/${ACCOUNT_ENDPOINT}/send_verification_email`), body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async getUser(uid: string): Promise<GetUserResponse> {
        return await axios
            .get(getApiUrl(`/${USER_ENDPOINT}/${uid}`), {
                headers: {
                    Authorization: `Bearer ${await getAuthTokenId()}`,
                },
            })
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async createUser() {
        return await axios
            .post(
                getApiUrl(`/${USER_ENDPOINT}/`),
                {},
                {
                    headers: {
                        Authorization: `Bearer ${await getAuthTokenId()}`,
                    },
                }
            )
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async createUserIfNew(uid: string) {
        const userResponse: GetUserResponse = await this.getUser(uid);
        if (userResponse.success) {
            console.log('skipping user creation, user already exists on new system');
            return;
        }

        console.log('creating user on new system');

        await this.createUser();
    }

    /*
     * ============= OLD SYSTEM LOGIC ==============
     */

    public static async update(user: UserModel) {
        await UserDao.update(user);
    }

    public static async get(uid: string) {
        //attempt get on new server, if not there try old
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

    public static async updatePostNotificationToken(token: string | null) {
        await UserDao.updateField('post_notification_token', token);
    }
}

export default UserController;
