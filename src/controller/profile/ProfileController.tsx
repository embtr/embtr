import ProfileDao from "src/firebase/firestore/profile/ProfileDao";

class ProfileController {
    public static getProfile(uid: string, callback: Function) {
        const result = ProfileDao.getProfile(uid);
        result.then(document => {
            if (document.exists()) {
                callback(document.data());
            } else {
                callback(undefined);
            }
        });
    }
}

export default ProfileController;