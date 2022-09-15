import { getAuth, User } from 'firebase/auth';
import { uploadImage } from 'src/firebase/cloud_storage/profiles/ProfileCsp';
import ProfileDao, { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { registerAuthStateListener } from 'src/session/CurrentUserProvider';
import { pickImage } from 'src/util/ImagePickerUtil';

export const enum UserType {
    USER,
    GUEST,
}

class ProfileController {
    public static getProfile(uid: string, callback: Function) {
        const result = ProfileDao.getProfile(uid);
        result.then((document) => {
            if (document.exists()) {
                callback(document.data());
            } else {
                callback(undefined);
            }
        });
    }

    public static getProfiles(uids: string[], callback: Function) {
        const result = ProfileDao.getProfiles(uids);

        let profiles: UserProfileModel[] = [];
        result
            .then((documents) => {
                documents.forEach((document) => {
                    let profile: UserProfileModel = document.data();
                    profiles.push(profile);
                });
                callback(profiles);
            })
            .catch(() => {
                callback([]);
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
        const nameLower: string = user.displayName!.toLowerCase();
        const email: string = user.email!;
        const photoUrl: string = user.photoURL!;

        ProfileDao.updateProfile({ uid: uid, name: name, nameLower: nameLower, email: email, photoUrl: photoUrl });
    }

    public static async updateProfile(userProfile: UserProfileModel) {
        userProfile.nameLower = userProfile?.name?.toLowerCase();
        await ProfileDao.updateProfile(userProfile);
    }

    public static async uploadProfilePhoto(): Promise<string | undefined> {
        const result = await pickImage();
        if (result && !result.cancelled) {
            const uploadUrl = await uploadImage(result.uri, 'profiles/' + getAuth().currentUser?.uid, 'profile');
            return uploadUrl;
        }

        return undefined;
    }

    public static async uploadProfileBanner(): Promise<string | undefined> {
        const result = await pickImage();
        if (result && !result.cancelled) {
            const uploadUrl = await uploadImage(result.uri, 'profiles/' + getAuth().currentUser?.uid, 'banner');
            return uploadUrl;
        }

        return undefined;
    }
}

export default ProfileController;
